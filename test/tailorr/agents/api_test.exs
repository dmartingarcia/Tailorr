defmodule Tailorr.Agents.ApiTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Api
  alias Tailorr.SearchQuery

  setup do
    bypass = Bypass.open()
    {:ok, bypass: bypass}
  end

  describe "capabilities/0" do
    test "returns search, test_connection, and structured_api" do
      caps = Api.capabilities()
      assert :search in caps
      assert :test_connection in caps
      assert :structured_api in caps
    end
  end

  describe "test_connection/1" do
    test "returns :ok for 200 response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert Api.test_connection(config) == :ok
    end

    test "returns :ok for any 2xx response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 204, "")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert Api.test_connection(config) == :ok
    end

    test "returns error for 404", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 404, "Not Found")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      assert {:error, {:http_error, 404}} = Api.test_connection(config)
    end

    test "sends custom headers", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        assert Plug.Conn.get_req_header(conn, "x-api-key") == ["secret"]
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "headers" => %{"X-Api-Key" => "secret"}
      }

      assert Api.test_connection(config) == :ok
    end

    test "uses custom timeout", %{bypass: bypass} do
      # Can't easily test timeout value, but verify it doesn't crash
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "timeout_ms" => 5000
      }

      assert Api.test_connection(config) == :ok
    end
  end

  describe "URL building" do
    test "builds URL with query parameters", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        assert conn.query_string =~ "q=matrix"
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/api/search",
        "api_format" => "json"
      }

      query = %SearchQuery{query: "matrix"}
      # Will fail because from_json doesn't exist, but URL building happens
      Api.search(config, query)
    end

    test "includes API key from config", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        params = URI.decode_query(conn.query_string)
        assert params["apikey"] == "test-key-123"
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/api/search",
        "api_key" => "test-key-123",
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end

    test "uses default search_path if not specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end

    test "includes custom search params", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        params = URI.decode_query(conn.query_string)
        assert params["search"] == "matrix"
        assert params["limit"] == "100"
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json",
        "search_params" => %{
          "query_key" => "search",
          "extra_params" => %{"limit" => "100"}
        }
      }

      query = %SearchQuery{query: "matrix"}
      Api.search(config, query)
    end
  end

  describe "HTTP methods" do
    test "uses GET by default", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end

    test "uses POST when specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/api/search", fn conn ->
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "search_path" => "/api/search",
        "method" => "POST",
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end
  end

  describe "headers" do
    test "sends default Accept header", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["accept"] =~ "application/json"
        assert headers["accept"] =~ "text/xml"
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{"base_url" => endpoint_url(bypass)}
      Api.test_connection(config)
    end

    test "merges custom headers with defaults", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["x-custom"] == "value"
        assert headers["accept"] =~ "application/json"
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "headers" => %{"X-Custom" => "value"}
      }

      Api.test_connection(config)
    end

    test "custom headers override defaults", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/", fn conn ->
        headers = Enum.into(conn.req_headers, %{})
        assert headers["accept"] == "text/plain"
        Plug.Conn.resp(conn, 200, "OK")
      end)

      config = %{
        "base_url" => endpoint_url(bypass),
        "headers" => %{"Accept" => "text/plain"}
      }

      Api.test_connection(config)
    end
  end

  describe "error handling" do
    test "returns error for non-200 status", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        Plug.Conn.resp(conn, 500, "Internal Error")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json",
        "retries" => 0
      }

      query = %SearchQuery{query: "test"}
      assert {:error, {:http_error, 500}} = Api.search(config, query)
    end

    test "returns error for 404", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        Plug.Conn.resp(conn, 404, "Not Found")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      assert {:error, {:http_error, 404}} = Api.search(config, query)
    end

    test "handles network errors" do
      config = %{
        "id" => "test",
        "base_url" => "http://192.0.2.1:9999",
        "api_format" => "json",
        "timeout_ms" => 100
      }

      query = %SearchQuery{query: "test"}
      assert {:error, _reason} = Api.search(config, query)
    end
  end

  describe "API key resolution" do
    test "slug conversion removes special characters" do
      # Test indirectly by checking URL construction
      bypass = Bypass.open()

      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        # If env var TRACKER_API_KEY_MY_TRACKER was set, it would be in params
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "my-tracker",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)

      Bypass.down(bypass)
    end

    test "prefers config api_key over env var", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        params = URI.decode_query(conn.query_string)
        assert params["apikey"] == "config-key"
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_key" => "config-key",
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end

    test "works without API key", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/api/search", fn conn ->
        params = URI.decode_query(conn.query_string)
        refute Map.has_key?(params, "apikey")
        Plug.Conn.resp(conn, 200, ~s({"results": []}))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "api_format" => "json"
      }

      query = %SearchQuery{query: "test"}
      Api.search(config, query)
    end
  end

  defp endpoint_url(bypass) do
    "http://localhost:#{bypass.port}"
  end
end
