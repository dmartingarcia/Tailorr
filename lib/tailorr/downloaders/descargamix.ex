defmodule Tailorr.Downloaders.DescargaMix do
  @moduledoc """
  DescargaMix-specific downloader.

  Unlike DonTorrent, DescargaMix provides direct .torrent file links
  embedded in detail pages — no POW challenge or CAPTCHA system.

  - Movie pages: single download link in `<a href='//descargamix.net/torrents/peliculas/...torrent'>`
  - Series pages: table of episodes, each `<tr>` has title, download link, and date.
  """

  @behaviour Tailorr.Downloaders.Behaviour

  require Logger

  @doc """
  Get download URL for a DescargaMix movie or documental result.

  Fetches the detail page and extracts the direct .torrent href.

  ## Parameters
    - detail_url: Full URL to the detail page
    - base_url: Tracker base URL (used for resolving protocol-relative URLs)

  ## Returns
    - {:ok, download_url} on success
    - {:error, reason} on failure
  """
  def get_download_url(detail_url, base_url) do
    case fetch_page(detail_url) do
      {:ok, html} -> extract_movie_download(html, base_url)
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Expand a season page into individual episode entries with download URLs.

  Fetches the season detail page and parses each episode row from the table.

  ## Parameters
    - season_url: Full URL to the season page
    - base_url: Tracker base URL

  ## Returns
    - {:ok, [%{episode_title, download_url, published_at}]} on success
    - {:error, reason} on failure
  """
  def expand_season(season_url, base_url) do
    Logger.debug("DescargaMix: Expanding season #{season_url}")

    case fetch_page(season_url) do
      {:ok, html} -> {:ok, parse_episode_table(html, base_url)}
      {:error, reason} -> {:error, reason}
    end
  end

  # --- Private ---

  defp fetch_page(url) do
    case Req.get(url,
           headers: [
             {"user-agent",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
             {"referer", "https://descargamix.net/"},
             {"accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
             {"accept-language", "es-ES,es;q=0.9,en;q=0.8"}
           ],
           receive_timeout: 20_000
         ) do
      {:ok, %{status: 200, body: html}} when is_binary(html) -> {:ok, html}
      {:ok, %{status: status}} -> {:error, {:http_error, status}}
      {:error, reason} -> {:error, reason}
    end
  end

  defp extract_movie_download(html, base_url) do
    case Floki.parse_document(html) do
      {:ok, doc} ->
        href =
          doc
          |> Floki.find("a[download]")
          |> Floki.attribute("href")
          |> Enum.find(&String.contains?(&1, ".torrent"))

        case href do
          nil ->
            {:error, :no_download_link}

          url ->
            {:ok, resolve_url(url, base_url)}
        end

      {:error, reason} ->
        {:error, {:parse_error, reason}}
    end
  end

  defp parse_episode_table(html, base_url) do
    case Floki.parse_document(html) do
      {:ok, doc} ->
        doc
        |> Floki.find("tbody tr")
        |> Enum.map(&parse_episode_row(&1, base_url))
        |> Enum.reject(&is_nil/1)

      {:error, _} ->
        []
    end
  end

  defp parse_episode_row(row, base_url) do
    tds = Floki.find(row, "td")

    episode_title =
      case List.first(tds) do
        nil -> nil
        td -> [td] |> Floki.text() |> String.trim()
      end

    download_href =
      row
      |> Floki.find("a[download]")
      |> Floki.attribute("href")
      |> Enum.find(&String.contains?(&1, ".torrent"))

    date_str =
      case Enum.at(tds, 2) do
        nil -> nil
        td -> [td] |> Floki.text() |> String.trim()
      end

    if episode_title && episode_title != "" && download_href do
      %{
        episode_title: episode_title,
        download_url: resolve_url(download_href, base_url),
        published_at: parse_episode_date(date_str)
      }
    else
      nil
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

  # Resolve protocol-relative URLs (//descargamix.net/...) to https
  defp resolve_url("//" <> rest, _base_url), do: "https://" <> rest
  defp resolve_url("http" <> _ = url, _base_url), do: url
  defp resolve_url("/" <> _ = path, base_url), do: String.trim_trailing(base_url, "/") <> path
  defp resolve_url(url, _base_url), do: url
end
