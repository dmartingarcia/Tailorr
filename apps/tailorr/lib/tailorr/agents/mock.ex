defmodule Tailorr.Agents.Mock do
  @moduledoc """
  Mock agent for testing. Returns hardcoded results.
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.{Result, SearchQuery}

  @impl true
  def capabilities, do: [:search, :test_connection]

  @impl true
  def search(_config, %SearchQuery{query: query}) do
    results = mock_results(query)
    {:ok, results}
  end

  @impl true
  def test_connection(_config), do: :ok

  # Mock results based on query
  defp mock_results(query) when is_binary(query) do
    query_lower = String.downcase(query)

    cond do
      String.contains?(query_lower, "matrix") -> matrix_results()
      String.contains?(query_lower, "spider") -> spider_results()
      String.contains?(query_lower, "test") -> test_results()
      true -> []
    end
  end

  defp matrix_results do
    [
      %Result{
        tracker_id: "mock",
        title: "Matrix [4K]",
        download_url: "https://example.com/torrents/matrix-4k.torrent",
        magnet_url:
          "magnet:?xt=urn:btih:1234567890ABCDEF1234567890ABCDEF12345678&dn=Matrix+4K",
        detail_url: "https://example.com/movie/matrix-4k",
        size_bytes: 15_728_640_000,
        seeders: 150,
        leechers: 25,
        category: "Películas",
        quality: "4K",
        published_at: ~U[2024-01-15 10:30:00Z]
      },
      %Result{
        tracker_id: "mock",
        title: "Matrix Reloaded [1080p]",
        download_url: "https://example.com/torrents/matrix-reloaded.torrent",
        magnet_url:
          "magnet:?xt=urn:btih:ABCDEF1234567890ABCDEF1234567890ABCDEF12&dn=Matrix+Reloaded",
        detail_url: "https://example.com/movie/matrix-reloaded",
        size_bytes: 8_589_934_592,
        seeders: 89,
        leechers: 12,
        category: "Películas",
        quality: "1080p",
        published_at: ~U[2024-01-10 15:20:00Z]
      },
      %Result{
        tracker_id: "mock",
        title: "Matrix Revolutions [720p]",
        download_url: "https://example.com/torrents/matrix-revolutions.torrent",
        detail_url: "https://example.com/movie/matrix-revolutions",
        size_bytes: 4_294_967_296,
        seeders: 45,
        leechers: 8,
        category: "Películas",
        quality: "720p",
        published_at: ~U[2024-01-05 09:15:00Z]
      }
    ]
  end

  defp spider_results do
    [
      %Result{
        tracker_id: "mock",
        title: "Spider-Man: No Way Home [4K]",
        download_url: "https://example.com/torrents/spiderman-nwh.torrent",
        magnet_url: "magnet:?xt=urn:btih:SPIDER123456789",
        size_bytes: 18_000_000_000,
        seeders: 200,
        leechers: 30,
        category: "Películas",
        quality: "4K"
      }
    ]
  end

  defp test_results do
    [
      %Result{
        tracker_id: "mock",
        title: "Test Movie [1080p]",
        download_url: "https://example.com/test.torrent",
        size_bytes: 1_073_741_824,
        seeders: 10,
        leechers: 2,
        category: "Test"
      }
    ]
  end
end
