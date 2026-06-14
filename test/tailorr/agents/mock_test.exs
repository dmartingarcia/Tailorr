defmodule Tailorr.Agents.MockTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Mock
  alias Tailorr.SearchQuery

  describe "capabilities/0" do
    test "returns search and test_connection capabilities" do
      caps = Mock.capabilities()
      assert :search in caps
      assert :test_connection in caps
    end
  end

  describe "test_connection/1" do
    test "always returns :ok" do
      assert Mock.test_connection(%{}) == :ok
      assert Mock.test_connection(%{"url" => "https://example.com"}) == :ok
      assert Mock.test_connection(nil) == :ok
    end
  end

  describe "search/2" do
    test "returns matrix results for 'matrix' query" do
      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Mock.search(%{}, query)

      assert length(results) == 3
      assert Enum.all?(results, &(&1.tracker_id == "mock"))

      titles = Enum.map(results, & &1.title)
      assert "Matrix [4K]" in titles
      assert "Matrix Reloaded [1080p]" in titles
      assert "Matrix Revolutions [720p]" in titles
    end

    test "returns matrix results for case-insensitive 'MATRIX'" do
      query = %SearchQuery{query: "MATRIX"}
      {:ok, results} = Mock.search(%{}, query)

      assert length(results) == 3
    end

    test "returns matrix results when 'matrix' is part of query" do
      query = %SearchQuery{query: "the matrix movie"}
      {:ok, results} = Mock.search(%{}, query)

      assert length(results) == 3
    end

    test "returns spider results for 'spider' query" do
      query = %SearchQuery{query: "spider"}
      {:ok, results} = Mock.search(%{}, query)

      assert length(results) == 1
      result = List.first(results)

      assert result.title == "Spider-Man: No Way Home [4K]"
      assert result.quality == "4K"
      assert result.seeders == 200
      assert result.size_bytes == 18_000_000_000
    end

    test "returns test results for 'test' query" do
      query = %SearchQuery{query: "test"}
      {:ok, results} = Mock.search(%{}, query)

      assert length(results) == 1
      result = List.first(results)

      assert result.title == "Test Movie [1080p]"
      assert result.category == "Test"
      assert result.size_bytes == 1_073_741_824
    end

    test "returns empty list for unknown query" do
      query = %SearchQuery{query: "unknown-movie-xyz"}
      {:ok, results} = Mock.search(%{}, query)

      assert results == []
    end

    test "returns empty list for empty query" do
      query = %SearchQuery{query: ""}
      {:ok, results} = Mock.search(%{}, query)

      assert results == []
    end

    test "matrix results have all required fields" do
      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Mock.search(%{}, query)

      first = List.first(results)

      assert first.tracker_id == "mock"
      assert first.title == "Matrix [4K]"
      assert first.download_url == "https://example.com/torrents/matrix-4k.torrent"

      assert first.magnet_url ==
               "magnet:?xt=urn:btih:1234567890ABCDEF1234567890ABCDEF12345678&dn=Matrix+4K"

      assert first.detail_url == "https://example.com/movie/matrix-4k"
      assert first.size_bytes == 15_728_640_000
      assert first.seeders == 150
      assert first.leechers == 25
      assert first.category == "Películas"
      assert first.quality == "4K"
      assert first.published_at == ~U[2024-01-15 10:30:00Z]
    end

    test "matrix results are ordered by quality (4K, 1080p, 720p)" do
      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Mock.search(%{}, query)

      qualities = Enum.map(results, & &1.quality)
      assert qualities == ["4K", "1080p", "720p"]
    end

    test "spider results have required fields" do
      query = %SearchQuery{query: "spider"}
      {:ok, results} = Mock.search(%{}, query)

      result = List.first(results)

      assert result.tracker_id == "mock"
      assert result.download_url != nil
      assert result.magnet_url != nil
      assert result.size_bytes > 0
      assert result.seeders > 0
    end

    test "works with any config" do
      query = %SearchQuery{query: "test"}

      {:ok, results1} = Mock.search(%{}, query)
      {:ok, results2} = Mock.search(%{"url" => "https://example.com"}, query)
      {:ok, results3} = Mock.search(nil, query)

      assert results1 == results2
      assert results2 == results3
    end
  end

  describe "result validity" do
    test "all matrix results are valid" do
      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Mock.search(%{}, query)

      assert Enum.all?(results, &Tailorr.Result.valid?/1)
    end

    test "all spider results are valid" do
      query = %SearchQuery{query: "spider"}
      {:ok, results} = Mock.search(%{}, query)

      assert Enum.all?(results, &Tailorr.Result.valid?/1)
    end

    test "all test results are valid" do
      query = %SearchQuery{query: "test"}
      {:ok, results} = Mock.search(%{}, query)

      assert Enum.all?(results, &Tailorr.Result.valid?/1)
    end
  end
end
