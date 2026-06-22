defmodule Tailorr.Downloaders.Behaviour do
  @moduledoc """
  Contract for tracker-specific downloaders.

  Downloaders resolve actual torrent/magnet URLs from detail pages.
  The scraper stays agnostic — it reads the `downloader` key from tracker
  config and dispatches through this behaviour.
  """

  @doc "Resolve a single download URL from a detail page."
  @callback get_download_url(detail_url :: String.t(), base_url :: String.t()) ::
              {:ok, String.t()} | {:error, term()}

  @doc "Expand a season/collection page into individual episode entries."
  @callback expand_season(season_url :: String.t(), base_url :: String.t()) ::
              {:ok, list(map())} | {:error, term()}
end
