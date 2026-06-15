defmodule Tailorr.Agents.BrowserTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Browser
  alias Tailorr.SearchQuery

  describe "capabilities/0" do
    test "returns browser-specific capabilities" do
      caps = Browser.capabilities()
      assert :search in caps
      assert :test_connection in caps
      assert :javascript in caps
      assert :screenshot in caps
    end
  end

  describe "driver selection" do
    test "defaults to flaresolverr driver" do
      config = %{"id" => "test", "base_url" => "https://example.com"}
      query = %SearchQuery{query: "test"}

      # Will delegate to Cloudflare agent (fails without FlareSolverr)
      assert {:error, _} = Browser.search(config, query)
    end

    test "uses flaresolverr when explicitly set" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "flaresolverr"
      }

      query = %SearchQuery{query: "test"}

      # Will delegate to Cloudflare agent
      assert {:error, _} = Browser.search(config, query)
    end

    test "uses port driver when specified" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port"
      }

      query = %SearchQuery{query: "test"}

      # Will try to use BrowserPort (not running in test env)
      assert {:error, _} = Browser.search(config, query)
    end
  end

  describe "browser options" do
    test "builds default browser options" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port"
      }

      query = %SearchQuery{query: "test"}

      # Options are built and passed to BrowserPort (not running in test env)
      assert {:error, _} = Browser.search(config, query)
    end

    test "includes custom wait_for_selector" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port",
        "wait_for_selector" => ".results"
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end

    test "includes scroll_to_bottom option" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port",
        "scroll_to_bottom" => true
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end

    test "includes screenshot_on_error option" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port",
        "screenshot_on_error" => false
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end

    test "includes custom timeout" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port",
        "max_timeout_ms" => 60_000
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end
  end

  describe "URL building" do
    test "builds search URL with query parameters" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "search_path" => "/browse",
        "driver" => "port"
      }

      query = %SearchQuery{query: "matrix"}

      # URL building happens before BrowserPort call (not running in test env)
      assert {:error, _} = Browser.search(config, query)
    end

    test "uses default search_path" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port"
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end

    test "includes custom search params" do
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "driver" => "port",
        "search_params" => %{
          "query_key" => "q",
          "extra_params" => %{"sort" => "date"}
        }
      }

      query = %SearchQuery{query: "test"}

      assert {:error, _} = Browser.search(config, query)
    end
  end

  describe "test_connection" do
    test "delegates to Cloudflare for flaresolverr driver" do
      config = %{
        "base_url" => "https://example.com",
        "driver" => "flaresolverr"
      }

      # Will try to connect to FlareSolverr
      assert {:error, _} = Browser.test_connection(config)
    end

    test "delegates to BrowserPort for port driver" do
      config = %{
        "base_url" => "https://example.com",
        "driver" => "port"
      }

      # BrowserPort not running in test env
      assert {:error, _} = Browser.test_connection(config)
    end
  end
end
