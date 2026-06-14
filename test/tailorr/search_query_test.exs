defmodule Tailorr.SearchQueryTest do
  use ExUnit.Case, async: true

  alias Tailorr.SearchQuery

  describe "from_params/1" do
    test "creates query with defaults" do
      query = SearchQuery.from_params(%{})

      assert query.query == ""
      assert query.categories == []
      assert query.limit == 100
      assert query.offset == 0
      assert query.type == :search
    end

    test "parses basic search query" do
      params = %{"q" => "matrix"}
      query = SearchQuery.from_params(params)

      assert query.query == "matrix"
      assert query.categories == []
      assert query.limit == 100
      assert query.type == :search
    end

    test "parses categories as comma-separated string" do
      params = %{"cat" => "5000,5030,5040"}
      query = SearchQuery.from_params(params)

      assert query.categories == ["5000", "5030", "5040"]
    end

    test "parses single category" do
      params = %{"cat" => "5000"}
      query = SearchQuery.from_params(params)

      assert query.categories == ["5000"]
    end

    test "handles categories with whitespace" do
      params = %{"cat" => " 5000 , 5030 , 5040 "}
      query = SearchQuery.from_params(params)

      assert query.categories == ["5000", "5030", "5040"]
    end

    test "parses limit parameter" do
      params = %{"limit" => "50"}
      query = SearchQuery.from_params(params)

      assert query.limit == 50
    end

    test "parses offset parameter" do
      params = %{"offset" => "25"}
      query = SearchQuery.from_params(params)

      assert query.offset == 25
    end

    test "parses search type" do
      assert SearchQuery.from_params(%{"t" => "search"}).type == :search
      assert SearchQuery.from_params(%{"t" => "movie"}).type == :movie
      assert SearchQuery.from_params(%{"t" => "tvsearch"}).type == :tvsearch
    end

    test "defaults to search type for unknown types" do
      assert SearchQuery.from_params(%{"t" => "unknown"}).type == :search
      assert SearchQuery.from_params(%{"t" => "music"}).type == :search
    end

    test "handles invalid limit gracefully" do
      params = %{"limit" => "invalid"}
      query = SearchQuery.from_params(params)

      assert query.limit == 100
    end

    test "handles invalid offset gracefully" do
      params = %{"offset" => "not-a-number"}
      query = SearchQuery.from_params(params)

      assert query.offset == 0
    end

    test "parses integer limit/offset directly" do
      params = %{"limit" => 50, "offset" => 25}
      query = SearchQuery.from_params(params)

      assert query.limit == 50
      assert query.offset == 25
    end

    test "parses complete Torznab query" do
      params = %{
        "q" => "the matrix",
        "cat" => "5000,5030",
        "limit" => "25",
        "offset" => "50",
        "t" => "movie"
      }

      query = SearchQuery.from_params(params)

      assert query.query == "the matrix"
      assert query.categories == ["5000", "5030"]
      assert query.limit == 25
      assert query.offset == 50
      assert query.type == :movie
    end

    test "handles empty category string" do
      assert SearchQuery.from_params(%{"cat" => ""}).categories == []
    end

    test "handles nil category" do
      assert SearchQuery.from_params(%{"cat" => nil}).categories == []
    end

    test "handles empty limit string" do
      assert SearchQuery.from_params(%{"limit" => ""}).limit == 100
    end

    test "handles nil limit" do
      assert SearchQuery.from_params(%{"limit" => nil}).limit == 100
    end
  end

  describe "to_params/2" do
    test "converts to default query parameter name" do
      query = %SearchQuery{query: "matrix"}
      config = %{}

      params = SearchQuery.to_params(query, config)

      assert params == %{"q" => "matrix"}
    end

    test "uses custom query_key from config" do
      query = %SearchQuery{query: "matrix"}
      config = %{"search_params" => %{"query_key" => "search"}}

      params = SearchQuery.to_params(query, config)

      assert params == %{"search" => "matrix"}
    end

    test "includes extra_params from config" do
      query = %SearchQuery{query: "matrix"}

      config = %{
        "search_params" => %{
          "query_key" => "q",
          "extra_params" => %{
            "page" => "1",
            "order" => "desc"
          }
        }
      }

      params = SearchQuery.to_params(query, config)

      assert params["q"] == "matrix"
      assert params["page"] == "1"
      assert params["order"] == "desc"
    end

    test "handles config without search_params" do
      query = %SearchQuery{query: "test"}
      config = %{"url" => "https://example.com"}

      params = SearchQuery.to_params(query, config)

      assert params == %{"q" => "test"}
    end

    test "converts empty query" do
      query = %SearchQuery{query: ""}
      config = %{}

      params = SearchQuery.to_params(query, config)

      assert params == %{"q" => ""}
    end

    test "extra_params override base params" do
      query = %SearchQuery{query: "original"}

      config = %{
        "search_params" => %{
          "query_key" => "q",
          "extra_params" => %{"q" => "overridden"}
        }
      }

      params = SearchQuery.to_params(query, config)

      assert params["q"] == "overridden"
    end
  end

  describe "struct defaults" do
    test "has correct default values" do
      query = %SearchQuery{}

      assert query.query == ""
      assert query.categories == []
      assert query.limit == 100
      assert query.offset == 0
      assert query.type == :search
    end
  end
end
