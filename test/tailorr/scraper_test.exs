defmodule Tailorr.ScraperTest do
  use ExUnit.Case, async: true

  alias Tailorr.Scraper

  describe "parse/2" do
    test "extracts results from basic HTML" do
      html = """
      <html>
        <body>
          <tr class="torrent">
            <td class="title">Test Movie</td>
            <td class="size">1.5 GB</td>
            <td class="seeders">100</td>
            <td><a href="/download/123">Download</a></td>
          </tr>
        </body>
      </html>
      """

      config = %{
        "id" => "test-tracker",
        "base_url" => "https://tracker.example.com",
        "parsing" => %{
          "result_rows" => "tr.torrent",
          "fields" => %{
            "title" => "td.title",
            "size" => "td.size",
            "seeders" => "td.seeders",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)

      assert length(results) == 1
      result = List.first(results)

      assert result.tracker_id == "test-tracker"
      assert result.title == "Test Movie"
      assert result.size_bytes == 1_500_000_000
      assert result.seeders == 100
      assert result.download_url == "https://tracker.example.com/download/123"
    end

    test "handles multiple results" do
      html = """
      <html>
        <body>
          <tr class="torrent">
            <td class="title">Movie 1</td>
          </tr>
          <tr class="torrent">
            <td class="title">Movie 2</td>
          </tr>
          <tr class="torrent">
            <td class="title">Movie 3</td>
          </tr>
        </body>
      </html>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "tr.torrent",
          "fields" => %{"title" => "td.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert length(results) == 3
    end

    test "filters out invalid results" do
      html = """
      <html>
        <tr><td class="title">Valid</td><td><a href="/dl">link</a></td></tr>
        <tr><td class="title"></td></tr>
        <tr><td class="other">No title</td></tr>
      </html>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "tr",
          "fields" => %{"title" => "td.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert length(results) == 1
      assert List.first(results).title == "Valid"
    end

    test "returns empty list for invalid HTML" do
      results = Scraper.parse("not valid html <<<<", %{"id" => "test"})
      assert results == []
    end

    test "returns empty list for nil HTML" do
      results = Scraper.parse(nil, %{"id" => "test"})
      assert results == []
    end

    test "returns empty list for empty config" do
      results = Scraper.parse("<html></html>", %{})
      assert results == []
    end
  end

  describe "CSS selector extraction" do
    test "extracts text from simple selector" do
      html = """
      <div class="container">
        <span class="title">Test Title</span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div.container",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == "Test Title"
    end

    test "extracts attribute with @ syntax" do
      html = """
      <div>
        <a class="download" href="/download/123.torrent">Download</a>
      </div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "a.download",
            "download_url" => "a.download@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      result = List.first(results)

      assert result.title == "Download"
      assert result.download_url == "https://example.com/download/123.torrent"
    end

    test "uses fallback selectors" do
      html = """
      <div>
        <span class="new-title">New Title</span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "span.old-title, span.new-title, span.fallback",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == "New Title"
    end

    test "returns nil when no fallback matches" do
      html = """
      <div>
        <p>No matching selector</p>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "span.title, div.title, h1.title",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      assert results == []
    end
  end

  describe "URL resolution" do
    test "resolves relative URLs" do
      html = """
      <div><a href="/download/file.torrent">DL</a></div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://tracker.example.com",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "a", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)

      assert List.first(results).download_url ==
               "https://tracker.example.com/download/file.torrent"
    end

    test "keeps absolute URLs unchanged" do
      html = """
      <div><a href="https://other-site.com/file.torrent">DL</a></div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://tracker.example.com",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "a", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).download_url == "https://other-site.com/file.torrent"
    end

    test "keeps magnet links unchanged" do
      html = """
      <div><a href="magnet:?xt=urn:btih:123abc">DL</a></div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://tracker.example.com",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "a", "magnet_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).magnet_url == "magnet:?xt=urn:btih:123abc"
    end

    test "handles protocol-relative URLs" do
      html = """
      <div><a href="//cdn.example.com/file.torrent">DL</a></div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://tracker.example.com",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "a", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).download_url == "https://cdn.example.com/file.torrent"
    end

    test "handles base_url with trailing slash" do
      html = """
      <div><a href="/download/file.torrent">DL</a></div>
      """

      config = %{
        "id" => "test",
        "base_url" => "https://tracker.example.com/",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "a", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)

      assert List.first(results).download_url ==
               "https://tracker.example.com/download/file.torrent"
    end
  end

  describe "HTML entity decoding" do
    test "decodes common HTML entities" do
      html = """
      <div>
        <span class="title">Test &amp; Movie &lt;2024&gt;</span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == "Test & Movie <2024>"
    end

    test "decodes quotes and apostrophes" do
      html = """
      <div>
        <span class="title">It&quot;s a &quot;test&quot;</span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == ~s(It"s a "test")
    end

    test "decodes nbsp to space" do
      html = """
      <div>
        <span class="title">Test&nbsp;Movie</span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == "Test Movie"
    end
  end

  describe "text normalization" do
    test "trims whitespace" do
      html = """
      <div>
        <span class="title">  Test Movie  </span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).title == "Test Movie"
    end

    test "handles multi-line text" do
      html = """
      <div>
        <span class="title">
          Test
          Movie
        </span>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{"title" => "span.title", "download_url" => "a@href"}
        }
      }

      results = Scraper.parse(html, config)
      # Floki.text extracts and normalizes whitespace
      assert String.contains?(List.first(results).title, "Test")
      assert String.contains?(List.first(results).title, "Movie")
    end
  end

  describe "field type extraction" do
    test "extracts and parses size" do
      html = """
      <div>
        <span class="title">Movie</span>
        <span class="size">2.5 GB</span>
        <a href="/dl">DL</a>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "span.title",
            "size" => "span.size",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      assert List.first(results).size_bytes == 2_500_000_000
    end

    test "extracts and parses integers" do
      html = """
      <div>
        <span class="title">Movie</span>
        <span class="seeders">150</span>
        <span class="leechers">25</span>
        <a href="/dl">DL</a>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "span.title",
            "seeders" => "span.seeders",
            "leechers" => "span.leechers",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      result = List.first(results)

      assert result.seeders == 150
      assert result.leechers == 25
    end

    test "extracts and parses dates" do
      html = """
      <div>
        <span class="title">Movie</span>
        <span class="date">2 days ago</span>
        <a href="/dl">DL</a>
      </div>
      """

      config = %{
        "id" => "test",
        "parsing" => %{
          "result_rows" => "div",
          "fields" => %{
            "title" => "span.title",
            "date" => "span.date",
            "download_url" => "a@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      result = List.first(results)

      assert result.published_at != nil
      assert %DateTime{} = result.published_at
    end
  end

  describe "complete result extraction" do
    test "extracts all fields from complex HTML" do
      html = """
      <html>
        <body>
          <table>
            <tr class="torrent-row">
              <td class="name"><a href="/details/123">The Matrix Reloaded</a></td>
              <td class="category">Movies</td>
              <td class="size">4.7 GB</td>
              <td class="date">3 hours ago</td>
              <td class="seeds">250</td>
              <td class="leech">10</td>
              <td class="quality">1080p</td>
              <td class="links">
                <a class="dl-link" href="/download/123.torrent">⬇</a>
                <a class="magnet" href="magnet:?xt=urn:btih:abc123">🧲</a>
              </td>
            </tr>
          </table>
        </body>
      </html>
      """

      config = %{
        "id" => "movies-tracker",
        "base_url" => "https://movies.example.com",
        "parsing" => %{
          "result_rows" => "tr.torrent-row",
          "fields" => %{
            "title" => "td.name a",
            "detail_url" => "td.name a@href",
            "category" => "td.category",
            "size" => "td.size",
            "date" => "td.date",
            "seeders" => "td.seeds",
            "leechers" => "td.leech",
            "quality" => "td.quality",
            "download_url" => "a.dl-link@href",
            "magnet_url" => "a.magnet@href"
          }
        }
      }

      results = Scraper.parse(html, config)
      assert length(results) == 1

      result = List.first(results)
      assert result.tracker_id == "movies-tracker"
      assert result.title == "The Matrix Reloaded"
      assert result.category == "Movies"
      assert result.size_bytes == 4_700_000_000
      assert result.seeders == 250
      assert result.leechers == 10
      assert result.quality == "1080p"
      assert result.download_url == "https://movies.example.com/download/123.torrent"
      assert result.detail_url == "https://movies.example.com/details/123"
      assert result.magnet_url == "magnet:?xt=urn:btih:abc123"
      assert %DateTime{} = result.published_at
    end
  end
end
