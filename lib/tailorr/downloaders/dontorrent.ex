defmodule Tailorr.Downloaders.DonTorrent do
  @moduledoc """
  DonTorrent-specific downloader with POW protection.
  Handles the complete flow: challenge → POW → validation → download URL.
  """

  @behaviour Tailorr.Downloaders.Behaviour

  alias Tailorr.{Captcha, Pow}
  alias Tailorr.Captcha.FileStorage
  require Logger

  @api_endpoint "/api_validate_pow.php"

  @doc """
  Get download URL for a DonTorrent result.

  ## Parameters
    - detail_url: Full URL to the detail page (e.g., https://9386-don.mirror.pm/pelicula/23404/Matrix-4K)
    - base_url: Tracker base URL

  ## Returns
    - {:ok, download_url} on success
    - {:error, reason} on failure
  """
  def get_download_url(detail_url, base_url) do
    with {:ok, content_id, tabla} <- parse_detail_url(detail_url),
         {:ok, challenge} <- generate_challenge(base_url, content_id, tabla),
         {:ok, nonce} <- Pow.compute(challenge, 3) do
      validate_pow(base_url, challenge, nonce)
    end
  end

  @doc """
  Expand a season page into individual episode entries with download URLs.

  Fetches the season detail page, parses episode rows, and resolves each
  episode's download URL via the POW mechanism.

  ## Parameters
    - season_url: Full URL to the season page (e.g., https://...don.../serie/886/888/Breaking-Bad-1-Temporada)
    - base_url: Tracker base URL

  ## Returns
    - {:ok, [%{episode_title, download_url, published_at}]} on success
    - {:error, reason} on failure
  """
  def expand_season(season_url, base_url) do
    Logger.debug("DonTorrent: Expanding season #{season_url}")

    case Req.get(season_url,
           headers: [
             {"user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
           ],
           receive_timeout: 20_000,
           retry: :transient,
           max_retries: 3,
           retry_delay: fn n -> Integer.pow(2, n) * 2_000 end
         ) do
      {:ok, %{status: 200, body: html}} when is_binary(html) ->
        {:ok, fetch_episode_downloads(html, base_url)}

      {:ok, %{status: status}} ->
        {:error, {:http_error, status}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp fetch_episode_downloads(html, base_url) do
    case Floki.parse_document(html) do
      {:ok, doc} ->
        rows = Floki.find(doc, "tbody tr")

        rows
        |> Task.async_stream(
          fn row -> parse_episode_row(row, base_url) end,
          timeout: 60_000,
          max_concurrency: 10,
          on_timeout: :kill_task
        )
        |> Enum.flat_map(fn
          {:ok, nil} -> []
          {:ok, ep} -> [ep]
          {:exit, _} -> []
        end)

      {:error, _} ->
        []
    end
  end

  defp parse_episode_row(row, base_url) do
    tds = Floki.find(row, "td")

    episode_title =
      case List.first(tds) do
        nil -> ""
        td -> [td] |> Floki.text() |> String.trim()
      end

    content_id_str =
      row
      |> Floki.find("[data-content-id]")
      |> Floki.attribute("data-content-id")
      |> List.first()

    date_str =
      case Enum.at(tds, 2) do
        nil -> nil
        td -> [td] |> Floki.text() |> String.trim()
      end

    with title when title != "" <- episode_title,
         id_str when is_binary(id_str) <- content_id_str,
         {content_id, _} <- Integer.parse(id_str),
         {:ok, challenge} <- generate_challenge(base_url, content_id, "series"),
         {:ok, nonce} <- Pow.compute(challenge, 3),
         {:ok, download_url} <- validate_pow(base_url, challenge, nonce) do
      %{
        episode_title: title,
        download_url: download_url,
        published_at: parse_episode_date(date_str)
      }
    else
      _ -> nil
    end
  end

  defp parse_episode_date(nil), do: nil
  defp parse_episode_date(""), do: nil

  defp parse_episode_date(date_str) do
    case Date.from_iso8601(date_str) do
      {:ok, date} -> DateTime.new!(date, ~T[00:00:00], "Etc/UTC")
      _ -> nil
    end
  end

  # Parse content_id and tabla from detail URL
  # URL format: /pelicula/23404/Matrix-4K or /serie/12345/Breaking-Bad
  defp parse_detail_url(url) do
    case Regex.run(~r{/(pelicula|serie|documental)/(\d+)/}, url) do
      [_, tabla_singular, content_id] ->
        # Convert singular to plural (pelicula → peliculas)
        tabla = tabla_singular <> "s"
        {:ok, String.to_integer(content_id), tabla}

      _ ->
        {:error, :invalid_detail_url}
    end
  end

  # Step 1: Generate challenge
  defp generate_challenge(base_url, content_id, tabla) do
    url = "#{base_url}#{@api_endpoint}"

    payload = %{
      action: "generate",
      content_id: content_id,
      tabla: tabla
    }

    Logger.debug("DonTorrent: Generating challenge for content_id=#{content_id}")

    case Req.post(url,
           json: payload,
           receive_timeout: 10_000,
           retry: :transient,
           max_retries: 3,
           retry_delay: fn n -> Integer.pow(2, n) * 1_000 end
         ) do
      {:ok, %{status: 200, body: %{"success" => true, "challenge" => challenge}}} ->
        {:ok, challenge}

      {:ok, %{body: %{"error" => error}}} ->
        {:error, {:api_error, error}}

      {:ok, %{status: status}} ->
        {:error, {:http_error, status}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  # Step 2: Validate POW (with CAPTCHA retry logic)
  defp validate_pow(base_url, challenge, nonce, captcha_solution \\ nil) do
    url = "#{base_url}#{@api_endpoint}"

    payload =
      %{
        action: "validate",
        challenge: challenge,
        nonce: nonce
      }
      |> maybe_add_captcha(captcha_solution)

    Logger.debug("DonTorrent: Validating POW (nonce=#{nonce})")

    case Req.post(url, json: payload, receive_timeout: 10_000) do
      # Success - got download URL
      {:ok, %{status: 200, body: %{"success" => true, "download_url" => download_url}}} ->
        {:ok, download_url}

      # Rate limit - hard block (60/hour)
      {:ok, %{status: 429, body: body}} ->
        wait_minutes = Map.get(body, "wait_minutes", 60)
        {:error, {:rate_limit_exceeded, wait_minutes}}

      # CAPTCHA required - soft block
      {:ok, %{status: 200, body: %{"status" => "captcha_required"} = body}} ->
        handle_captcha_challenge(base_url, challenge, nonce, body)

      # Other errors
      {:ok, %{body: %{"error" => error}}} ->
        {:error, {:api_error, error}}

      {:ok, %{status: status}} ->
        {:error, {:http_error, status}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp maybe_add_captcha(payload, nil), do: payload
  defp maybe_add_captcha(payload, solution), do: Map.put(payload, :captcha_solution, solution)

  defp handle_captcha_challenge(base_url, challenge, nonce, captcha_data) do
    captcha_image = Map.get(captcha_data, "captcha_image")
    message = Map.get(captcha_data, "message", "Resuelve el CAPTCHA")

    captcha_input = %{
      image: captcha_image,
      image_type: :base64,
      message: message,
      tracker: "dontorrent"
    }

    # Check cache before calling any solver
    case FileStorage.lookup_cache(captcha_input) do
      {:ok, cached_solution} ->
        Logger.info("DonTorrent: CAPTCHA hit cache, reusing solution")
        validate_pow(base_url, challenge, nonce, cached_solution)

      :miss ->
        Logger.info("DonTorrent: CAPTCHA required — attempting to solve")
        FileStorage.save_pending(captcha_input, "dontorrent", %{source: :pow})

        case Captcha.solve(captcha_input) do
          {:ok, solution} ->
            FileStorage.save_success(captcha_input, solution, "dontorrent", %{source: :pow})
            validate_pow(base_url, challenge, nonce, solution)

          {:error, :user_cancelled} ->
            FileStorage.save_failure(captcha_input, "dontorrent", %{
              source: :pow,
              reason: "user_cancelled"
            })

            {:error, :captcha_cancelled}

          {:error, reason} ->
            FileStorage.save_failure(captcha_input, "dontorrent", %{
              source: :pow,
              reason: inspect(reason)
            })

            {:error, {:captcha_failed, reason}}
        end
    end
  end
end
