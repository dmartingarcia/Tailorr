defmodule Mix.Tasks.Tailorr.TestTracker do
  @shortdoc "Run a test search against a tracker definition"
  @moduledoc """
  Test a tracker definition by running a live search.

      mix tailorr.test_tracker <tracker_id> [query]

  Loads the tracker YAML from tracker_definitions/ and runs a search.
  The query defaults to "test" if not provided.

  ## Examples

      mix tailorr.test_tracker nyaa
      mix tailorr.test_tracker nyaa "ubuntu 22.04"
  """

  use Mix.Task

  alias Tailorr.{TrackerLoader, SearchQuery}

  @requirements ["app.start"]

  @impl Mix.Task
  def run([]) do
    Mix.shell().error("Usage: mix tailorr.test_tracker <tracker_id> [query]")
    exit({:shutdown, 1})
  end

  def run([tracker_id | rest]) do
    query_string = Enum.join(rest, " ")
    query_string = if query_string == "", do: "test", else: query_string

    Mix.shell().info("Testing tracker: #{tracker_id}")
    Mix.shell().info("Query: #{query_string}")
    Mix.shell().info("")

    case TrackerLoader.load_one(tracker_id) do
      nil ->
        Mix.shell().error("Tracker '#{tracker_id}' not found in tracker_definitions/")
        list_available_trackers()
        exit({:shutdown, 1})

      config ->
        run_search(config, query_string)
    end
  end

  defp run_search(config, query_string) do
    tracker_id = config["id"]
    agent_type = config["agent"] || "http"
    agent_module = agent_module(agent_type)

    Mix.shell().info("Tracker: #{config["name"]} (#{tracker_id})")
    Mix.shell().info("Agent:   #{agent_type}")
    Mix.shell().info("URL:     #{config["base_url"]}")
    Mix.shell().info("")

    query = SearchQuery.new(query_string)

    Mix.shell().info("Searching...")

    case agent_module.search(config, query) do
      {:ok, results} when is_list(results) ->
        print_results(results)

      {:error, reason} ->
        Mix.shell().error("Search failed: #{inspect(reason)}")
        exit({:shutdown, 1})
    end
  end

  defp print_results([]) do
    Mix.shell().info("No results found.")
  end

  defp print_results(results) do
    Mix.shell().info("Found #{length(results)} result(s):\n")

    results
    |> Enum.with_index(1)
    |> Enum.each(fn {result, i} ->
      Mix.shell().info("#{i}. #{result.title}")
      if result.size_bytes, do: Mix.shell().info("   Size:     #{format_size(result.size_bytes)}")
      if result.seeders, do: Mix.shell().info("   Seeders:  #{result.seeders}")
      if result.leechers, do: Mix.shell().info("   Leechers: #{result.leechers}")
      if result.download_url, do: Mix.shell().info("   Download: #{result.download_url}")

      if result.magnet_url,
        do: Mix.shell().info("   Magnet:   #{String.slice(result.magnet_url, 0, 80)}...")

      Mix.shell().info("")
    end)
  end

  defp format_size(bytes) when bytes >= 1_073_741_824 do
    "#{Float.round(bytes / 1_073_741_824, 2)} GB"
  end

  defp format_size(bytes) when bytes >= 1_048_576 do
    "#{Float.round(bytes / 1_048_576, 2)} MB"
  end

  defp format_size(bytes) when bytes >= 1_024 do
    "#{Float.round(bytes / 1_024, 2)} KB"
  end

  defp format_size(bytes), do: "#{bytes} B"

  defp list_available_trackers do
    all = TrackerLoader.load_all()

    if map_size(all) > 0 do
      Mix.shell().info("\nAvailable trackers:")

      Enum.each(all, fn {id, config} ->
        Mix.shell().info("  #{id} — #{config["name"]}")
      end)
    else
      Mix.shell().info("\nNo tracker definitions found in tracker_definitions/")
    end
  end

  defp agent_module("http"), do: Tailorr.Agents.Http
  defp agent_module("cloudflare"), do: Tailorr.Agents.Cloudflare
  defp agent_module("browser"), do: Tailorr.Agents.Browser
  defp agent_module("api"), do: Tailorr.Agents.Api
  defp agent_module("auth"), do: Tailorr.Agents.Auth
  defp agent_module(other), do: Mix.raise("Unknown agent type: #{other}")
end
