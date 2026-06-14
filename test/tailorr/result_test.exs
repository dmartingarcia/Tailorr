defmodule Tailorr.ResultTest do
  use ExUnit.Case, async: true

  alias Tailorr.Result

  describe "new/1" do
    test "creates result with all fields" do
      attrs = %{
        tracker_id: "test",
        title: "Test Movie",
        download_url: "https://example.com/test.torrent",
        magnet_url: "magnet:?xt=urn:btih:123",
        detail_url: "https://example.com/details/123",
        size_bytes: 1_073_741_824,
        seeders: 100,
        leechers: 20,
        category: "Movies",
        published_at: ~U[2024-01-15 10:30:00Z],
        quality: "1080p",
        raw_data: %{"extra" => "data"}
      }

      result = Result.new(attrs)

      assert result.tracker_id == "test"
      assert result.title == "Test Movie"
      assert result.download_url == "https://example.com/test.torrent"
      assert result.magnet_url == "magnet:?xt=urn:btih:123"
      assert result.detail_url == "https://example.com/details/123"
      assert result.size_bytes == 1_073_741_824
      assert result.seeders == 100
      assert result.leechers == 20
      assert result.category == "Movies"
      assert result.published_at == ~U[2024-01-15 10:30:00Z]
      assert result.quality == "1080p"
      assert result.raw_data == %{"extra" => "data"}
    end

    test "creates result with minimal fields" do
      attrs = %{
        tracker_id: "test",
        title: "Minimal Result",
        download_url: "https://example.com/test.torrent"
      }

      result = Result.new(attrs)

      assert result.tracker_id == "test"
      assert result.title == "Minimal Result"
      assert result.download_url == "https://example.com/test.torrent"
      assert result.magnet_url == nil
      assert result.detail_url == nil
      assert result.size_bytes == nil
      assert result.seeders == nil
      assert result.leechers == nil
      assert result.category == nil
      assert result.published_at == nil
      assert result.quality == nil
      assert result.raw_data == %{}
    end

    test "creates result with empty raw_data by default" do
      result = Result.new(%{tracker_id: "test", title: "Test", download_url: "url"})
      assert result.raw_data == %{}
    end
  end

  describe "valid?/1" do
    test "valid with download_url" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        download_url: "https://example.com/test.torrent"
      }

      assert Result.valid?(result)
    end

    test "valid with magnet_url" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        magnet_url: "magnet:?xt=urn:btih:123"
      }

      assert Result.valid?(result)
    end

    test "valid with detail_url" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        detail_url: "https://example.com/details/123"
      }

      assert Result.valid?(result)
    end

    test "valid with multiple URLs" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        download_url: "https://example.com/test.torrent",
        magnet_url: "magnet:?xt=urn:btih:123",
        detail_url: "https://example.com/details/123"
      }

      assert Result.valid?(result)
    end

    test "invalid when title is nil" do
      result = %Result{
        tracker_id: "test",
        title: nil,
        download_url: "https://example.com/test.torrent"
      }

      refute Result.valid?(result)
    end

    test "invalid when title is empty string" do
      result = %Result{
        tracker_id: "test",
        title: "",
        download_url: "https://example.com/test.torrent"
      }

      refute Result.valid?(result)
    end

    test "invalid when all URLs are nil" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        download_url: nil,
        magnet_url: nil,
        detail_url: nil
      }

      refute Result.valid?(result)
    end

    test "invalid when all URLs are empty strings" do
      result = %Result{
        tracker_id: "test",
        title: "Test Movie",
        download_url: "",
        magnet_url: "",
        detail_url: ""
      }

      refute Result.valid?(result)
    end

    test "invalid when both title and URLs are missing" do
      result = %Result{
        tracker_id: "test",
        title: nil,
        download_url: nil,
        magnet_url: nil,
        detail_url: nil
      }

      refute Result.valid?(result)
    end

    test "valid with only one non-empty URL" do
      result1 = %Result{
        title: "Test",
        download_url: "url",
        magnet_url: nil,
        detail_url: ""
      }

      result2 = %Result{
        title: "Test",
        download_url: "",
        magnet_url: "magnet:123",
        detail_url: nil
      }

      result3 = %Result{
        title: "Test",
        download_url: nil,
        magnet_url: "",
        detail_url: "https://example.com"
      }

      assert Result.valid?(result1)
      assert Result.valid?(result2)
      assert Result.valid?(result3)
    end
  end

  describe "struct defaults" do
    test "has correct default values" do
      result = %Result{}

      assert result.tracker_id == nil
      assert result.title == nil
      assert result.download_url == nil
      assert result.magnet_url == nil
      assert result.detail_url == nil
      assert result.size_bytes == nil
      assert result.seeders == nil
      assert result.leechers == nil
      assert result.category == nil
      assert result.published_at == nil
      assert result.quality == nil
      assert result.raw_data == %{}
    end
  end
end
