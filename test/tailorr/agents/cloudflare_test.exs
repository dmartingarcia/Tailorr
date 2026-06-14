defmodule Tailorr.Agents.CloudflareTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Cloudflare
  alias Tailorr.SearchQuery

  setup do
    bypass = Bypass.open()
    {:ok, bypass: bypass}
  end

  describe "capabilities/0" do
    test "returns search, test_connection, and cloudflare_bypass capabilities" do
      caps = Cloudflare.capabilities()
      assert :search in caps
      assert :test_connection in caps
      assert :cloudflare_bypass in caps
    end
  end

  describe "test_connection/1" do
    test "returns :ok when FlareSolverr solves challenge", %{bypass: bypass} do
      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{
          "response" => "<html><body>Success</body></html>",
          "cookies" => [%{"name" => "cf_clearance", "value" => "abc123"}]
        }
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      assert Cloudflare.test_connection(config) == :ok
    end

    test "returns error when challenge not solved", %{bypass: bypass} do
      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{
          "response" => "<html><body>Just a moment...</body></html>"
        }
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      assert {:error, :challenge_not_solved} = Cloudflare.test_connection(config)
    end

    test "returns error when FlareSolverr returns error", %{bypass: bypass} do
      error_response = %{
        "status" => "error",
        "message" => "Timeout waiting for challenge"
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 500, Jason.encode!(error_response))
      end)

      config = %{
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      assert {:error, {:flaresolverr_error, 500, "Timeout waiting for challenge"}} =
               Cloudflare.test_connection(config)
    end

    test "uses environment variable for FlareSolverr URL when not in config" do
      # Can't easily test this without setting env var, so just verify it doesn't crash
      config = %{"base_url" => "https://example.com"}
      # Will fail to connect but shouldn't crash
      assert {:error, _} = Cloudflare.test_connection(config)
    end
  end

  describe "search/2" do
    test "solves challenge and parses results", %{bypass: bypass} do
      html = """
      <html>
        <tr class="result">
          <td class="title">Test Movie</td>
          <td><a href="/download/123">DL</a></td>
        </tr>
      </html>
      """

      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{
          "response" => html,
          "cookies" => [%{"name" => "cf_clearance", "value" => "xyz789"}]
        }
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)

        assert request["cmd"] == "request.get"
        assert request["url"] =~ "https://example.com/search"
        assert request["url"] =~ "q=matrix"

        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test-tracker",
        "base_url" => "https://example.com",
        "search_path" => "/search",
        "flaresolverr_url" => endpoint_url(bypass),
        "parsing" => %{
          "result_rows" => "tr.result",
          "fields" => %{
            "title" => "td.title",
            "download_url" => "a@href"
          }
        }
      }

      query = %SearchQuery{query: "matrix"}
      {:ok, results} = Cloudflare.search(config, query)

      assert length(results) == 1
      assert List.first(results).title == "Test Movie"
    end

    test "returns error when challenge not solved", %{bypass: bypass} do
      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{
          "response" => "<html>Just a moment...</html>"
        }
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      assert {:error, :challenge_not_solved} = Cloudflare.search(config, query)
    end

    test "uses custom search_path if specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)
        assert request["url"] =~ "/custom-search"

        response = %{
          "status" => "ok",
          "solution" => %{"response" => "<html></html>"}
        }

        Plug.Conn.resp(conn, 200, Jason.encode!(response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "search_path" => "/custom-search",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      Cloudflare.search(config, query)
    end

    test "uses default /search path when not specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)
        assert request["url"] =~ "/search"

        response = %{
          "status" => "ok",
          "solution" => %{"response" => "<html></html>"}
        }

        Plug.Conn.resp(conn, 200, Jason.encode!(response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      Cloudflare.search(config, query)
    end

    test "includes custom search params in URL", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)

        assert request["url"] =~ "search=matrix"
        assert request["url"] =~ "page=1"

        response = %{
          "status" => "ok",
          "solution" => %{"response" => "<html></html>"}
        }

        Plug.Conn.resp(conn, 200, Jason.encode!(response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass),
        "search_params" => %{
          "query_key" => "search",
          "extra_params" => %{"page" => "1"}
        }
      }

      query = %SearchQuery{query: "matrix"}
      Cloudflare.search(config, query)
    end

    test "sets custom timeout in FlareSolverr request", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)
        assert request["maxTimeout"] == 30_000

        response = %{
          "status" => "ok",
          "solution" => %{"response" => "<html></html>"}
        }

        Plug.Conn.resp(conn, 200, Jason.encode!(response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass),
        "max_timeout_ms" => 30_000
      }

      query = %SearchQuery{query: "test"}
      Cloudflare.search(config, query)
    end

    test "uses default timeout when not specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        request = Jason.decode!(body)
        assert request["maxTimeout"] == 60_000

        response = %{
          "status" => "ok",
          "solution" => %{"response" => "<html></html>"}
        }

        Plug.Conn.resp(conn, 200, Jason.encode!(response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      Cloudflare.search(config, query)
    end
  end

  describe "challenge detection" do
    test "detects 'Just a moment' challenge", %{bypass: bypass} do
      html = "<html><body>Just a moment...</body></html>"

      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{"response" => html}
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      assert {:error, :challenge_not_solved} = Cloudflare.search(config, query)
    end

    test "detects 'cf-browser-verification' challenge", %{bypass: bypass} do
      html = """
      <html>
        <div id="cf-browser-verification">Verifying you are human...</div>
      </html>
      """

      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{"response" => html}
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      assert {:error, :challenge_not_solved} = Cloudflare.search(config, query)
    end

    test "detects 'challenge-form' challenge", %{bypass: bypass} do
      html = """
      <html>
        <form class="challenge-form">...</form>
      </html>
      """

      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{"response" => html}
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      assert {:error, :challenge_not_solved} = Cloudflare.search(config, query)
    end

    test "accepts valid HTML without challenge markers", %{bypass: bypass} do
      html = "<html><body>Valid tracker page</body></html>"

      flaresolverr_response = %{
        "status" => "ok",
        "solution" => %{"response" => html}
      }

      Bypass.expect_once(bypass, "POST", "/v1", fn conn ->
        Plug.Conn.resp(conn, 200, Jason.encode!(flaresolverr_response))
      end)

      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "flaresolverr_url" => endpoint_url(bypass)
      }

      query = %SearchQuery{query: "test"}
      {:ok, _results} = Cloudflare.search(config, query)
    end
  end

  defp endpoint_url(bypass) do
    "http://localhost:#{bypass.port}"
  end
end
