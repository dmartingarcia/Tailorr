defmodule Tailorr.Builder.YamlGeneratorTest do
  use ExUnit.Case, async: true

  alias Tailorr.Builder.YamlGenerator

  describe "build/2" do
    test "returns {:ok, yaml_string} tuple" do
      selectors = %{"title" => "h2 a"}

      config = %{
        id: "test",
        name: "Test Tracker",
        agent: "http",
        search_url: "https://example.com/search",
        result_rows: "tr.result"
      }

      assert {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert is_binary(yaml)
    end

    test "includes id from config" do
      selectors = %{}
      config = %{id: "my_tracker"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "id: my_tracker"
    end

    test "includes name from config" do
      selectors = %{}
      config = %{id: "t", name: "My Tracker"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "name: My Tracker"
    end

    test "includes agent from config" do
      selectors = %{}
      config = %{id: "t", agent: "cloudflare"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "agent: cloudflare"
    end

    test "includes search_url from config" do
      selectors = %{}
      config = %{id: "t", search_url: "https://tracker.example.com/search?q={query}"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "https://tracker.example.com/search?q={query}"
    end

    test "includes result_rows from config" do
      selectors = %{}
      config = %{id: "t", result_rows: "table.results tr"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "table.results tr"
    end

    test "includes title selector from selectors map" do
      selectors = %{"title" => "h2.title a"}
      config = %{id: "t"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "h2.title a"
    end

    test "includes download selector from selectors map" do
      selectors = %{"download" => "a.download::attr(href)"}
      config = %{id: "t"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "a.download::attr(href)"
    end

    test "includes size selector from selectors map" do
      selectors = %{"size" => "td.filesize"}
      config = %{id: "t"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "td.filesize"
    end

    test "includes seeders selector from selectors map" do
      selectors = %{"seeders" => "td.seeds span"}
      config = %{id: "t"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "td.seeds span"
    end

    test "includes leechers selector from selectors map" do
      selectors = %{"leechers" => "td.leech em"}
      config = %{id: "t"}

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "td.leech em"
    end

    test "falls back to default id when not in config" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "id: new_tracker"
    end

    test "falls back to default name when not in config" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "name: New Tracker"
    end

    test "falls back to default agent when not in config" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "agent: http"
    end

    test "falls back to default selectors when not provided" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "td.title a"
      assert yaml =~ "td.download a::attr(href)"
      assert yaml =~ "td.size"
      assert yaml =~ "td.seeds"
      assert yaml =~ "td.leeches"
    end

    test "yaml contains search section" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "search:"
      assert yaml =~ "url:"
    end

    test "yaml contains parsing section with fields" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "parsing:"
      assert yaml =~ "fields:"
    end

    test "yaml contains result_rows under parsing" do
      {:ok, yaml} = YamlGenerator.build(%{}, %{})
      assert yaml =~ "result_rows:"
    end

    test "accepts empty selectors map" do
      assert {:ok, _yaml} = YamlGenerator.build(%{}, %{id: "t"})
    end

    test "accepts full selector set with full config" do
      selectors = %{
        "title" => "h1 a",
        "download" => "a.torrent",
        "size" => "span.size",
        "seeders" => "span.s",
        "leechers" => "span.l"
      }

      config = %{
        id: "full_tracker",
        name: "Full Tracker",
        agent: "browser",
        search_url: "https://full.example.com/search",
        result_rows: "div.result"
      }

      {:ok, yaml} = YamlGenerator.build(selectors, config)
      assert yaml =~ "id: full_tracker"
      assert yaml =~ "name: Full Tracker"
      assert yaml =~ "agent: browser"
      assert yaml =~ "h1 a"
      assert yaml =~ "a.torrent"
      assert yaml =~ "span.size"
      assert yaml =~ "span.s"
      assert yaml =~ "span.l"
    end
  end
end
