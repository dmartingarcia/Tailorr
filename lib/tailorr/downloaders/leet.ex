defmodule Tailorr.Downloaders.Leet do
  @moduledoc """
  Downloader for 1337x / 1377x.to.

  Fetches the torrent detail page and extracts the magnet link from the
  `a.torrentdown1` element, which is the stable selector used across all
  1337x mirror domains.
  """

  @behaviour Tailorr.Downloaders.Behaviour

  require Logger

  @user_agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

  @impl true
  def get_download_url(detail_url, _base_url) do
    Logger.debug("Leet: Fetching detail page #{detail_url}")

    case Req.get(detail_url,
           headers: [{"user-agent", @user_agent}],
           receive_timeout: 15_000,
           retry: :transient,
           max_retries: 2,
           retry_delay: fn n -> Integer.pow(2, n) * 1_000 end
         ) do
      {:ok, %{status: 200, body: html}} when is_binary(html) ->
        extract_magnet(html, detail_url)

      {:ok, %{status: status}} ->
        Logger.warning("Leet: Detail page returned HTTP #{status} for #{detail_url}")
        {:error, {:http_error, status}}

      {:error, reason} ->
        Logger.warning("Leet: Failed to fetch detail page #{detail_url}: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @impl true
  def expand_season(_season_url, _base_url), do: {:ok, []}

  # --- Private ---

  defp extract_magnet(html, detail_url) do
    case Floki.parse_document(html) do
      {:ok, doc} ->
        doc
        |> Floki.find("a.torrentdown1")
        |> Floki.attribute("href")
        |> Enum.find(&String.starts_with?(&1, "magnet:"))
        |> case do
          nil ->
            Logger.warning("Leet: No magnet link found on #{detail_url}")
            {:error, :no_magnet_found}

          magnet ->
            {:ok, magnet}
        end

      {:error, reason} ->
        {:error, {:parse_error, reason}}
    end
  end
end
