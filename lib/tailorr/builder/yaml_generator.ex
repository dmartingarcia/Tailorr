defmodule Tailorr.Builder.YamlGenerator do
  @moduledoc """
  Generates YAML tracker definitions from selector maps.

  SRP: Only handles YAML generation from validated data.
  """

  @doc """
  Build YAML string from selectors and config.

  ## Examples

      iex> YamlGenerator.build(%{"title" => "h2 a"}, %{id: "test"})
      {:ok, "id: test\\nname: Test\\n..."}
  """
  def build(selectors, config) when is_map(selectors) do
    {:ok, render_yaml(selectors, config)}
  end

  defp render_yaml(selectors, config) do
    id = config[:id] || "new_tracker"
    name = config[:name] || "New Tracker"
    agent = config[:agent] || "http"
    search_url = config[:search_url] || "https://example.com/search?q={query}"
    result_rows = config[:result_rows] || "tr.result"
    fields = render_fields(selectors)

    """
    id: #{id}
    name: #{name}
    agent: #{agent}

    search:
      url: "#{search_url}"

    parsing:
      result_rows: "#{result_rows}"
      fields:
    #{fields}
    """
  end

  defp render_fields(selectors) do
    [
      {"title", selectors["title"] || "td.title a"},
      {"download_url", selectors["download"] || "td.download a::attr(href)"},
      {"size", selectors["size"] || "td.size"},
      {"seeders", selectors["seeders"] || "td.seeds"},
      {"leechers", selectors["leechers"] || "td.leeches"}
    ]
    |> Enum.map_join("\n", fn {key, val} -> "        #{key}: \"#{val}\"" end)
  end
end
