defmodule Tailorr.SearchQuery do
  @moduledoc """
  Search query parameters normalized from Torznab/Newznab API requests.

  Torznab query parameters (t=search):
  - q: search query string
  - cat: category IDs (comma-separated)
  - limit: max results (default 100)
  - offset: pagination offset

  This module converts those to internal representation and provides
  helpers to convert back to tracker-specific URL parameters.
  """

  @type t :: %__MODULE__{
          query: String.t(),
          categories: [String.t()],
          limit: integer(),
          offset: integer(),
          type: atom()
        }

  defstruct query: "",
            categories: [],
            limit: 100,
            offset: 0,
            type: :search

  @doc """
  Create a SearchQuery from a plain string query.
  """
  def new(query) when is_binary(query) do
    %__MODULE__{query: query}
  end

  @doc """
  Create a SearchQuery from Torznab API parameters.
  """
  def from_params(params) do
    %__MODULE__{
      query: Map.get(params, "q", ""),
      categories: parse_categories(Map.get(params, "cat", "")),
      limit: parse_int(Map.get(params, "limit", "100"), 100),
      offset: parse_int(Map.get(params, "offset", "0"), 0),
      type: parse_type(Map.get(params, "t", "search"))
    }
  end

  @doc """
  Convert SearchQuery to tracker-specific URL parameters.

  Uses the tracker config to determine the correct parameter names
  and format. For example:
  - Some trackers use "q", others use "search" or "s"
  - Some need extra params like "search=1" or "Buscar=Buscar"
  """
  def to_params(%__MODULE__{} = query, config) do
    search_params = config["search_params"] || %{}
    extra_params = search_params["extra_params"] || %{}

    # query_key: null means the query is embedded in the path via {query} placeholder;
    # do not add it as a query string parameter.
    base =
      case Map.get(search_params, "query_key", "q") do
        nil -> %{}
        "" -> %{}
        key -> %{key => query.query}
      end

    Map.merge(base, extra_params)
  end

  # --- Private ---

  defp parse_categories(""), do: []
  defp parse_categories(nil), do: []

  defp parse_categories(cat_string) when is_binary(cat_string) do
    cat_string
    |> String.split(",", trim: true)
    |> Enum.map(&String.trim/1)
  end

  defp parse_int(nil, default), do: default
  defp parse_int("", default), do: default

  defp parse_int(str, default) when is_binary(str) do
    case Integer.parse(str) do
      {int, _} -> int
      :error -> default
    end
  end

  defp parse_int(int, _default) when is_integer(int), do: int

  defp parse_type("search"), do: :search
  defp parse_type("movie"), do: :movie
  defp parse_type("tvsearch"), do: :tvsearch
  defp parse_type(_), do: :search
end
