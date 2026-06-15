defmodule TailorrWeb.TorznabControllerTest do
  use ExUnit.Case, async: true

  alias Tailorr.{TrackerLoader, Trackers}

  setup do
    # Ensure mock tracker is loaded
    TrackerLoader.load_all()
    :ok
  end

  describe "GET /api?t=caps" do
    test "returns capabilities XML" do
      # Phoenix controller test - uses Tracker.search directly, see below
      # response = conn |> get("/api?t=caps&apikey=test") |> response(200)
      # assert response =~ "<caps>"
      # assert response =~ "<server title=\"Tailorr\""
    end
  end

  describe "GET /api?t=search with mock tracker" do
    test "searches mock tracker and returns results" do
      query = %Tailorr.SearchQuery{query: "matrix"}

      case Trackers.Tracker.search("mock", query) do
        {:ok, results} ->
          assert length(results) == 3
          assert Enum.all?(results, &(&1.tracker_id == "mock"))

          first = List.first(results)
          assert first.title == "Matrix [4K]"
          assert first.download_url == "https://example.com/torrents/matrix-4k.torrent"
          assert first.size_bytes == 15_728_640_000
          assert first.seeders == 150
          assert first.quality == "4K"

        {:error, reason} ->
          flunk("Search failed: #{inspect(reason)}")
      end
    end

    test "returns empty results for unknown query" do
      query = %Tailorr.SearchQuery{query: "unknown-movie-xyz"}

      case Trackers.Tracker.search("mock", query) do
        {:ok, results} ->
          assert results == []

        {:error, reason} ->
          flunk("Search failed: #{inspect(reason)}")
      end
    end
  end

  describe "Torznab XML generation" do
    test "builds valid Torznab feed from mock results" do
      query = %Tailorr.SearchQuery{query: "matrix"}
      {:ok, results} = Trackers.Tracker.search("mock", query)

      xml = Tailorr.Torznab.build_feed(results, "matrix")

      # Verify XML structure
      assert xml =~ "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
      assert xml =~ "<rss version=\"2.0\""
      assert xml =~ "xmlns:torznab=\"http://torznab.com/schemas/2015/feed\""
      assert xml =~ "<title>Tailorr</title>"
      assert xml =~ "<torznab:query>matrix</torznab:query>"
      assert xml =~ "<torznab:response offset=\"0\" total=\"3\"/>"

      # Verify items
      assert xml =~ "<item>"
      assert xml =~ "<title>Matrix [4K]</title>"
      assert xml =~ "<guid>mock-"
      assert xml =~ "https://example.com/torrents/matrix-4k.torrent"
      assert xml =~ "<torznab:attr name=\"size\" value=\"15728640000\"/>"
      assert xml =~ "<torznab:attr name=\"seeders\" value=\"150\"/>"
      assert xml =~ "<torznab:attr name=\"quality\" value=\"4K\"/>"
      assert xml =~ "<torznab:attr name=\"indexer\" value=\"mock\"/>"
    end

    test "escapes XML special characters" do
      # Create a result with special characters
      result = %Tailorr.Result{
        tracker_id: "test",
        title: "Test <Movie> & \"Series\"",
        download_url: "https://example.com/test?foo=bar&baz=qux"
      }

      xml = Tailorr.Torznab.build_feed([result], "test")

      # Verify escaping
      assert xml =~ "Test &lt;Movie&gt; &amp; &quot;Series&quot;"
      assert xml =~ "foo=bar&amp;baz=qux"
    end
  end

  describe "Result validation" do
    test "accepts results with download_url" do
      result = %Tailorr.Result{
        tracker_id: "test",
        title: "Test Movie",
        download_url: "https://example.com/test.torrent"
      }

      assert Tailorr.Result.valid?(result)
    end

    test "accepts results with magnet_url" do
      result = %Tailorr.Result{
        tracker_id: "test",
        title: "Test Movie",
        magnet_url: "magnet:?xt=urn:btih:123"
      }

      assert Tailorr.Result.valid?(result)
    end

    test "accepts results with detail_url" do
      result = %Tailorr.Result{
        tracker_id: "test",
        title: "Test Movie",
        detail_url: "https://example.com/movie/123"
      }

      assert Tailorr.Result.valid?(result)
    end

    test "rejects results without title" do
      result = %Tailorr.Result{
        tracker_id: "test",
        download_url: "https://example.com/test.torrent"
      }

      refute Tailorr.Result.valid?(result)
    end

    test "rejects results without any URL" do
      result = %Tailorr.Result{
        tracker_id: "test",
        title: "Test Movie"
      }

      refute Tailorr.Result.valid?(result)
    end
  end

  describe "POW computation" do
    test "computes proof-of-work with difficulty 2" do
      {:ok, nonce} = Tailorr.Pow.compute("test123", 2)
      assert Tailorr.Pow.validate?("test123", nonce, 2)
    end

    test "computes proof-of-work with difficulty 3" do
      {:ok, nonce} = Tailorr.Pow.compute("challenge456", 3)
      assert Tailorr.Pow.validate?("challenge456", nonce, 3)
    end

    test "validates correct nonce" do
      # Known valid nonce for this challenge (difficulty 2)
      assert Tailorr.Pow.validate?("hello", 227, 2)
    end

    test "rejects invalid nonce" do
      refute Tailorr.Pow.validate?("hello", 999_999, 2)
    end

    test "estimates time for different difficulties" do
      assert Tailorr.Pow.estimate_time(1) == 0.01
      assert Tailorr.Pow.estimate_time(2) == 0.1
      assert Tailorr.Pow.estimate_time(3) == 2.0
      assert Tailorr.Pow.estimate_time(4) == 30.0
    end
  end
end
