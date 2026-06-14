defmodule Tailorr.NormalizerTest do
  use ExUnit.Case, async: true

  alias Tailorr.Normalizer

  describe "parse_size/2" do
    test "parses decimal units (KB, MB, GB, TB)" do
      assert Normalizer.parse_size("1 KB", :any) == 1_000
      assert Normalizer.parse_size("1 MB", :any) == 1_000_000
      assert Normalizer.parse_size("1 GB", :any) == 1_000_000_000
      assert Normalizer.parse_size("1 TB", :any) == 1_000_000_000_000
    end

    test "parses binary units (KiB, MiB, GiB, TiB)" do
      assert Normalizer.parse_size("1 KiB", :any) == 1_024
      assert Normalizer.parse_size("1 MiB", :any) == 1_048_576
      assert Normalizer.parse_size("1 GiB", :any) == 1_073_741_824
      assert Normalizer.parse_size("1 TiB", :any) == 1_099_511_627_776
    end

    test "parses fractional sizes" do
      assert Normalizer.parse_size("1.5 GB", :any) == 1_500_000_000
      assert Normalizer.parse_size("2.3 GiB", :any) == 2_469_606_195
      assert Normalizer.parse_size("750 MB", :any) == 750_000_000
      assert Normalizer.parse_size("0.5 GB", :any) == 500_000_000
    end

    test "handles comma as decimal separator" do
      assert Normalizer.parse_size("1,5 GB", :any) == 1_500_000_000
      assert Normalizer.parse_size("2,3 MiB", :any) == 2_411_724
    end

    test "ignores case" do
      assert Normalizer.parse_size("1 gb", :any) == 1_000_000_000
      assert Normalizer.parse_size("1 GB", :any) == 1_000_000_000
      assert Normalizer.parse_size("1 Gb", :any) == 1_000_000_000
    end

    test "handles sizes without spaces" do
      assert Normalizer.parse_size("1GB", :any) == 1_000_000_000
      assert Normalizer.parse_size("1.5GB", :any) == 1_500_000_000
    end

    test "parses plain byte numbers" do
      assert Normalizer.parse_size("1234567", :any) == 1_234_567
      assert Normalizer.parse_size("999", :any) == 999
    end

    test "returns nil for empty or nil input" do
      assert Normalizer.parse_size(nil, :any) == nil
      assert Normalizer.parse_size("", :any) == nil
    end

    test "returns nil for unparseable strings" do
      assert Normalizer.parse_size("invalid", :any) == nil
      assert Normalizer.parse_size("no numbers here", :any) == nil
    end
  end

  describe "parse_date/1" do
    test "parses ISO8601 format" do
      {:ok, expected, 0} = DateTime.from_iso8601("2024-01-15T10:30:00Z")
      result = Normalizer.parse_date("2024-01-15T10:30:00Z")
      assert result == expected
    end

    test "parses relative dates - seconds" do
      result = Normalizer.parse_date("30 seconds ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :second)
      assert diff >= 29 and diff <= 31
    end

    test "parses relative dates - minutes" do
      result = Normalizer.parse_date("5 minutes ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :minute)
      assert diff >= 4 and diff <= 6
    end

    test "parses relative dates - hours" do
      result = Normalizer.parse_date("2 hours ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :hour)
      assert diff >= 1 and diff <= 3
    end

    test "parses relative dates - days" do
      result = Normalizer.parse_date("3 days ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :day)
      assert diff >= 2 and diff <= 4
    end

    test "parses relative dates - weeks" do
      result = Normalizer.parse_date("2 weeks ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :day)
      assert diff >= 13 and diff <= 15
    end

    test "parses relative dates - months" do
      result = Normalizer.parse_date("1 month ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :day)
      assert diff >= 29 and diff <= 31
    end

    test "parses relative dates - years" do
      result = Normalizer.parse_date("1 year ago")
      now = DateTime.utc_now()
      diff = DateTime.diff(now, result, :day)
      assert diff >= 364 and diff <= 366
    end

    test "handles singular and plural units" do
      result_singular = Normalizer.parse_date("1 day ago")
      result_plural = Normalizer.parse_date("1 days ago")

      diff1 = DateTime.diff(DateTime.utc_now(), result_singular, :day)
      diff2 = DateTime.diff(DateTime.utc_now(), result_plural, :day)

      assert diff1 >= 0 and diff1 <= 2
      assert diff2 >= 0 and diff2 <= 2
    end

    test "returns nil for empty or nil input" do
      assert Normalizer.parse_date(nil) == nil
      assert Normalizer.parse_date("") == nil
    end

    test "returns nil for unparseable dates" do
      assert Normalizer.parse_date("invalid date") == nil
      assert Normalizer.parse_date("January 1st") == nil
    end

    test "returns nil for invalid ISO8601" do
      assert Normalizer.parse_date("2024-13-45T25:99:99Z") == nil
    end
  end

  describe "parse_int/1" do
    test "parses plain integers" do
      assert Normalizer.parse_int("123") == 123
      assert Normalizer.parse_int("0") == 0
      assert Normalizer.parse_int("999999") == 999_999
    end

    test "returns integer if already an integer" do
      assert Normalizer.parse_int(42) == 42
      assert Normalizer.parse_int(0) == 0
    end

    test "strips non-numeric characters" do
      assert Normalizer.parse_int("1,234") == 1234
      assert Normalizer.parse_int("$50") == 50
      assert Normalizer.parse_int("100 seeders") == 100
      assert Normalizer.parse_int("Price: 99.99") == 9999
    end

    test "handles numbers with whitespace" do
      assert Normalizer.parse_int("  123  ") == 123
      assert Normalizer.parse_int("1 2 3") == 123
    end

    test "returns nil for empty or nil input" do
      assert Normalizer.parse_int(nil) == nil
      assert Normalizer.parse_int("") == nil
    end

    test "returns nil for strings with no digits" do
      assert Normalizer.parse_int("no numbers") == nil
      assert Normalizer.parse_int("abc") == nil
    end
  end

  describe "from_torznab_xml/1" do
    @torznab_xml """
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Search results</title>
        <item>
          <title>Test Movie 1080p BluRay</title>
          <link>https://example.com/download/1.torrent</link>
        </item>
        <item>
          <title>Another Show S01E01</title>
          <link>https://example.com/download/2.torrent</link>
        </item>
      </channel>
    </rss>
    """

    test "returns {:ok, results} for valid Torznab XML" do
      assert {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      assert is_list(results)
    end

    test "parses all items in the feed" do
      {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      assert length(results) == 2
    end

    test "extracts title from each item" do
      {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      titles = Enum.map(results, & &1.title)
      assert "Test Movie 1080p BluRay" in titles
      assert "Another Show S01E01" in titles
    end

    test "extracts download_url from each item" do
      {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      urls = Enum.map(results, & &1.download_url)
      assert "https://example.com/download/1.torrent" in urls
      assert "https://example.com/download/2.torrent" in urls
    end

    test "each result is a %Tailorr.Result{} struct" do
      {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      Enum.each(results, fn r -> assert %Tailorr.Result{} = r end)
    end

    test "sets tracker_id to \"api\" for each result" do
      {:ok, results} = Normalizer.from_torznab_xml(@torznab_xml)
      Enum.each(results, fn r -> assert r.tracker_id == "api" end)
    end

    test "filters out items with no title" do
      xml = """
      <?xml version="1.0"?>
      <rss><channel>
        <item><title>Valid Title</title><link>https://example.com/1.torrent</link></item>
        <item><link>https://example.com/2.torrent</link></item>
      </channel></rss>
      """

      {:ok, results} = Normalizer.from_torznab_xml(xml)
      assert length(results) == 1
      assert hd(results).title == "Valid Title"
    end

    test "returns {:ok, []} for a feed with no items" do
      xml = """
      <?xml version="1.0"?>
      <rss><channel><title>Empty</title></channel></rss>
      """

      assert {:ok, []} = Normalizer.from_torznab_xml(xml)
    end
  end

  describe "from_rss/1" do
    @rss_xml """
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Tracker RSS Feed</title>
        <item>
          <title>Linux Distro ISO x86_64</title>
          <link>https://tracker.example.com/download/linux.torrent</link>
        </item>
        <item>
          <title>Open Source Movie 720p</title>
          <link>https://tracker.example.com/download/movie.torrent</link>
        </item>
      </channel>
    </rss>
    """

    test "returns {:ok, results} for valid RSS XML" do
      assert {:ok, results} = Normalizer.from_rss(@rss_xml)
      assert is_list(results)
    end

    test "parses all items in the RSS feed" do
      {:ok, results} = Normalizer.from_rss(@rss_xml)
      assert length(results) == 2
    end

    test "extracts title from each RSS item" do
      {:ok, results} = Normalizer.from_rss(@rss_xml)
      titles = Enum.map(results, & &1.title)
      assert "Linux Distro ISO x86_64" in titles
      assert "Open Source Movie 720p" in titles
    end

    test "extracts download_url from each RSS item" do
      {:ok, results} = Normalizer.from_rss(@rss_xml)
      urls = Enum.map(results, & &1.download_url)
      assert "https://tracker.example.com/download/linux.torrent" in urls
      assert "https://tracker.example.com/download/movie.torrent" in urls
    end

    test "each result is a %Tailorr.Result{} struct" do
      {:ok, results} = Normalizer.from_rss(@rss_xml)
      Enum.each(results, fn r -> assert %Tailorr.Result{} = r end)
    end

    test "sets tracker_id to \"rss\" for each result" do
      {:ok, results} = Normalizer.from_rss(@rss_xml)
      Enum.each(results, fn r -> assert r.tracker_id == "rss" end)
    end

    test "filters out items with no title" do
      xml = """
      <?xml version="1.0"?>
      <rss><channel>
        <item><title>Has Title</title><link>https://example.com/a.torrent</link></item>
        <item><link>https://example.com/b.torrent</link></item>
      </channel></rss>
      """

      {:ok, results} = Normalizer.from_rss(xml)
      assert length(results) == 1
      assert hd(results).title == "Has Title"
    end

    test "returns {:ok, []} for a feed with no items" do
      xml = """
      <?xml version="1.0"?>
      <rss><channel><title>Empty Feed</title></channel></rss>
      """

      assert {:ok, []} = Normalizer.from_rss(xml)
    end
  end

  describe "from_json/2" do
    test "returns {:ok, results} for a JSON array with field mapping" do
      json = Jason.encode!([%{"name" => "Movie One", "url" => "https://example.com/1.torrent"}])
      mapping = %{"title" => "name", "download_url" => "url"}

      assert {:ok, results} = Normalizer.from_json(json, mapping)
      assert is_list(results)
    end

    test "parses all items in the JSON array" do
      items = [
        %{"name" => "Movie One", "url" => "https://example.com/1.torrent"},
        %{"name" => "Show S01E01", "url" => "https://example.com/2.torrent"}
      ]

      json = Jason.encode!(items)
      mapping = %{"title" => "name", "download_url" => "url"}

      {:ok, results} = Normalizer.from_json(json, mapping)
      assert length(results) == 2
    end

    test "maps title field using provided mapping" do
      json =
        Jason.encode!([%{"name" => "Mapped Title", "url" => "https://example.com/1.torrent"}])

      mapping = %{"title" => "name", "download_url" => "url"}

      {:ok, [result]} = Normalizer.from_json(json, mapping)
      assert result.title == "Mapped Title"
    end

    test "maps download_url field using provided mapping" do
      json = Jason.encode!([%{"name" => "Title", "url" => "https://example.com/my.torrent"}])
      mapping = %{"title" => "name", "download_url" => "url"}

      {:ok, [result]} = Normalizer.from_json(json, mapping)
      assert result.download_url == "https://example.com/my.torrent"
    end

    test "uses default field names when mapping keys are absent" do
      json =
        Jason.encode!([
          %{"title" => "Default Title", "download_url" => "https://example.com/d.torrent"}
        ])

      {:ok, [result]} = Normalizer.from_json(json, %{})
      assert result.title == "Default Title"
      assert result.download_url == "https://example.com/d.torrent"
    end

    test "each result is a %Tailorr.Result{} struct" do
      json = Jason.encode!([%{"title" => "A", "download_url" => "https://example.com/a.torrent"}])

      {:ok, results} = Normalizer.from_json(json, %{})
      Enum.each(results, fn r -> assert %Tailorr.Result{} = r end)
    end

    test "sets tracker_id to \"json\" for each result" do
      json = Jason.encode!([%{"title" => "A", "download_url" => "https://example.com/a.torrent"}])

      {:ok, results} = Normalizer.from_json(json, %{})
      Enum.each(results, fn r -> assert r.tracker_id == "json" end)
    end

    test "filters out items with no title" do
      items = [
        %{"title" => "Has Title", "download_url" => "https://example.com/1.torrent"},
        %{"download_url" => "https://example.com/2.torrent"}
      ]

      json = Jason.encode!(items)

      {:ok, results} = Normalizer.from_json(json, %{})
      assert length(results) == 1
      assert hd(results).title == "Has Title"
    end

    test "supports JSON object with a nested results array via results_key mapping" do
      data = %{
        "torrents" => [
          %{"title" => "Nested Title", "download_url" => "https://example.com/n.torrent"}
        ]
      }

      json = Jason.encode!(data)
      mapping = %{"results_key" => "torrents"}

      {:ok, results} = Normalizer.from_json(json, mapping)
      assert length(results) == 1
      assert hd(results).title == "Nested Title"
    end

    test "returns {:ok, []} for a JSON array with no usable items" do
      json = Jason.encode!([%{"download_url" => "https://example.com/1.torrent"}])

      assert {:ok, []} = Normalizer.from_json(json, %{})
    end

    test "returns {:error, {:json_decode_error, _}} for invalid JSON" do
      assert {:error, {:json_decode_error, _reason}} =
               Normalizer.from_json("not json at all", %{})
    end

    test "returns {:error, {:json_decode_error, _}} for truncated JSON" do
      assert {:error, {:json_decode_error, _reason}} = Normalizer.from_json("[{\"title\":", %{})
    end
  end
end
