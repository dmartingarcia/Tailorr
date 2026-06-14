defmodule Tailorr.Downloaders.DonTorrent do
  @moduledoc """
  DonTorrent-specific downloader with POW protection.
  Handles the complete flow: challenge → POW → validation → download URL.
  """

  alias Tailorr.{Pow, Captcha}
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
         {:ok, nonce} <- Pow.compute(challenge, 3),
         {:ok, download_url} <- validate_pow(base_url, challenge, nonce) do
      {:ok, download_url}
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

    case Req.post(url, json: payload, receive_timeout: 10_000) do
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
      message: message
    }

    Logger.info("DonTorrent: CAPTCHA required - attempting to solve")

    case Captcha.solve(captcha_input) do
      {:ok, solution} ->
        # Retry validation with CAPTCHA solution
        validate_pow(base_url, challenge, nonce, solution)

      {:error, :user_cancelled} ->
        {:error, :captcha_cancelled}

      {:error, reason} ->
        {:error, {:captcha_failed, reason}}
    end
  end
end
