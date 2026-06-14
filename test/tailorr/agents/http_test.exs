defmodule Tailorr.Agents.HttpTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Http
  alias Tailorr.SearchQuery

  setup do
    bypass = Bypass.open()
    {:ok, bypass: bypass}
  end

  describe "capabilities/0" do
    test "returns search and test_connection capabilities" do
      caps = Http.capabilities()
      assert :search in caps
      assert :test_connection in caps
    end
  end

  describe "test_connection/1" do
    test "returns :ok for successful 200 response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert Http.test_connection(config) == :ok
    end

    test "returns :ok for any 2xx response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 201, "Created")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert Http.test_connection(config) == :ok
    end

    test "returns error for 404", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 404, "Not Found")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert {:error, {:http_error, 404}} = Http.test_connection(config)
    end

    test "returns error for 500", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 500, "Internal Server Error")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert {:error, {:http_error, 500}} = Http.test_connection(config)
    end

    test "sends custom headers", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        assert Plug.Conn.get_req_header(conn, "x-custom") == ["test-value"]
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "headers" => %{"X-Custom" => "test-value"}
      }

      assert Http.test_connection(config) == :ok
    end
  end

  describe "search/2 GET" do
    test "performs GET request and parses results", %{bypass: bypass} do
      html = """
      <html>
        <tr class="result">
          <td class="title">Test Movie</td>
          <td><a href="/download/123">DL</a></td>
        </tr>
      </html>
      """

      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        assert conn.query_string == "q=matrix"
        Plug.Conn.resp(conn, 200, html)
      end)

      config = %{
        "id" => "test-tracker",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search",
        "parsing" => %{
          "result_rows" => "tr.result",
          "fields" => %{
            "title" => "td.title",
            "download_url" => "a@href"
          }
        }
      }

      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Http.search(config, query)

      assert length(results) == 1
      assert List.first(results).title == "Test Movie"
    end

    test "includes custom query parameters", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        params = URI.decode_query(conn.query_string)
        assert params["search"] == "matrix"
        assert params["page"] == "1"
        Plug.Conn.resp(conn, 200, "<html></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search",
        "search_params" => %{
          "query_key" => "search",
          "extra_params" => %{"page" => "1"}
        }
      }

      query = %SearchQuery{query: "matrix"}
      {:ok, _results} = Http.search(config, query)
    end

    test "uses default search_path if not specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        Plug.Conn.resp(conn, 200, "<html></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      {:ok, _results} = Http.search(config, query)
    end

    test "returns error for 404", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        Plug.Conn.resp(conn, 404, "Not Found")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search"
      }

      query = %SearchQuery{query: "test"}
      assert {:error, {:http_error, 404}} = Http.search(config, query)
    end

    test "returns error for 500", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        Plug.Conn.resp(conn, 500, "Server Error")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search"
      }

      query = %SearchQuery{query: "test"}
      assert {:error, {:http_error, 500}} = Http.search(config, query)
    end
  end

  describe "search/2 POST" do
    test "performs POST request with form data", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/search", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        params = URI.decode_query(body)
        assert params["q"] == "matrix"
        Plug.Conn.resp(conn, 200, "<html></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search",
        "search_method" => "POST"
      }

      query = %SearchQuery{query: "matrix"}
      {:ok, _results} = Http.search(config, query)
    end

    test "handles POST with custom search_params", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/search", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        params = URI.decode_query(body)
        assert params["buscar"] == "matrix"
        assert params["submit"] == "Buscar"
        Plug.Conn.resp(conn, 200, "<html></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search",
        "search_method" => "POST",
        "search_params" => %{
          "query_key" => "buscar",
          "extra_params" => %{"submit" => "Buscar"}
        }
      }

      query = %SearchQuery{query: "matrix"}
      {:ok, _results} = Http.search(config, query)
    end
  end

  describe "headers" do
    test "sends default headers", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["user-agent"] =~ "Mozilla"
        assert headers["accept"] =~ "text/html"
        assert headers["accept-language"] =~ "es-ES"
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      Http.test_connection(config)
    end

    test "merges custom headers with defaults", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["user-agent"] == "CustomBot/1.0"
        assert headers["x-custom"] == "value"
        assert headers["accept"] =~ "text/html"
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "headers" => %{
          "User-Agent" => "CustomBot/1.0",
          "X-Custom" => "value"
        }
      }

      Http.test_connection(config)
    end

    test "sets Referer to base_url by default", %{bypass: bypass} do
      base_url = endpoint_url(bypass)

      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["referer"] == base_url
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{"base_url" => base_url}
      Http.test_connection(config)
    end
  end

  describe "compression" do
    test "handles gzip compressed responses", %{bypass: bypass} do
      html = "<html><body>Test</body></html>"
      compressed = :zlib.gzip(html)

      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        conn
        |> Plug.Conn.put_resp_header("content-encoding", "gzip")
        |> Plug.Conn.resp(200, compressed)
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search"
      }

      query = %SearchQuery{query: "test"}
      # Req should automatically decompress
      {:ok, _results} = Http.search(config, query)
    end
  end

  describe "error handling" do
    test "returns error for network timeout" do
      config = %{
        "id" => "test",
        "base_url" => "http://192.0.2.1:9999",
        "timeout_ms" => 100
      }

      query = %SearchQuery{query: "test"}
      assert {:error, _reason} = Http.search(config, query)
    end

    test "handles empty response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/search", fn conn ->
        Plug.Conn.resp(conn, 200, "")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/search"
      }

      query = %SearchQuery{query: "test"}
      {:ok, results} = Http.search(config, query)
      assert results == []
    end
  end

  # Helper to get bypass URL
  defp endpoint_url(bypass) do
    "http://localhost:#{bypass.port}"
  end
end
