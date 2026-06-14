defmodule Mix.Tasks.Tailorr.TestTracker do
  @moduledoc """
  Test a tracker definition by running a search query.

  Usage:
      mix tailorr.test_tracker TRACKER_ID [QUERY]

  Examples:
      mix tailorr.test_tracker mejortorrent
      mix tailorr.test_tracker dontorrent "matrix"

  This task:
  1. Loads the tracker YAML definition
  2. Initializes the appropriate agent
  3. Runs a search query (default: "test")
  4. Displays results with details
  5. Validates that results have required fields
  """

  use Mix.Task
  require Logger

  alias Tailorr.{TrackerLoader, SearchQuery, Normalizer}

  @shortdoc "Test a tracker definition"

  @impl Mix.Task
  def run(args) do
    # Start application dependencies
    Mix.Task.run("app.start")

    case args do
      [tracker_id | rest] ->
        query_text = Enum.join(rest, " ")
        query_text = if query_text == "", do: "test", else: query_text
        test_tracker(tracker_id, query_text)

      [] ->
        Mix.shell().error("Usage: mix tailorr.test_tracker TRACKER_ID [QUERY]")
        exit(:normal)
    end
  end

  defp test_tracker(tracker_id, query_text) do
    Mix.shell().info("Testing tracker: #{tracker_id}")
    Mix.shell().info("Query: #{query_text}")
    Mix.shell().info(String.duplicate("=", 80))

    # Load tracker config
    config = TrackerLoader.load_one(tracker_id)

    if is_nil(config) do
      Mix.shell().error("Tracker not found: #{tracker_id}")
      Mix.shell().info("Available trackers:")

      TrackerLoader.load_all()
      |> Enum.each(fn {id, cfg} ->
        enabled = if cfg["enabled"], do: "✓", else: "✗"
        Mix.shell().info("  #{enabled} #{id} - #{cfg["name"]} (#{cfg["agent"]})")
      end)

      exit(:normal)
    end

    # Check if enabled
    unless config["enabled"] do
      Mix.shell().error("⚠️  Tracker is disabled in YAML (enabled: false)")
      Mix.shell().info("This test will run anyway, but results may be unreliable.")
      Mix.shell().info("")
    end

    # Show tracker info
    Mix.shell().info("Tracker: #{config["name"]}")
    Mix.shell().info("Agent: #{config["agent"]}")
    Mix.shell().info("Base URL: #{config["base_url"]}")
    Mix.shell().info("")

    # Build agent
    agent_module = get_agent_module(config["agent"])

    # Create search query
    query = %SearchQuery{query: query_text}

    # Run search
    Mix.shell().info("Searching...")

    case agent_module.search(config, query) do
      {:ok, results} ->
        display_results(results, config)

      {:error, reason} ->
        Mix.shell().error("Search failed: #{inspect(reason)}")
        exit(:normal)
    end
  end

  defp display_results([], _config) do
    Mix.shell().error("No results found")
  end

  defp display_results(results, config) do
    Mix.shell().info("Found #{length(results)} results\n")

    results
    |> Enum.take(10)
    |> Enum.with_index(1)
    |> Enum.each(fn {result, index} ->
      Mix.shell().info("Result ##{index}")
      Mix.shell().info("  Title: #{result.title || "(missing)"}")

      if result.size_bytes do
        size_gb = result.size_bytes / 1_073_741_824
        Mix.shell().info("  Size: #{:erlang.float_to_binary(size_gb, decimals: 2)} GB")
      end

      if result.seeders do
        Mix.shell().info("  Seeds/Leech: #{result.seeders}/#{result.leechers || 0}")
      end

      if result.quality do
        Mix.shell().info("  Quality: #{result.quality}")
      end

      if result.category do
        Mix.shell().info("  Category: #{result.category}")
      end

      if result.download_url do
        Mix.shell().info("  Download: #{result.download_url}")
      end

      if result.magnet_url do
        Mix.shell().info("  Magnet: #{String.slice(result.magnet_url, 0, 60)}...")
      end

      if result.detail_url do
        Mix.shell().info("  Detail: #{result.detail_url}")
      end

      Mix.shell().info("")
    end)

    # Summary
    if length(results) > 10 do
      Mix.shell().info("... and #{length(results) - 10} more results")
    end

    # Validation summary
    valid_count = Enum.count(results, &Tailorr.Result.valid?/1)

    Mix.shell().info(String.duplicate("=", 80))
    Mix.shell().info("Valid results: #{valid_count}/#{length(results)}")

    if valid_count < length(results) do
      Mix.shell().error("⚠️  Some results are invalid (missing title or download link)")
      Mix.shell().error("Check your selectors in: tracker_definitions/.../#{config["id"]}.yml")
    else
      Mix.shell().info("✓ All results are valid!")
    end
  end

  defp get_agent_module(agent_type) do
    case agent_type do
      "http" -> Tailorr.Agents.Http
      "cloudflare" -> Tailorr.Agents.Cloudflare
      "browser" -> Tailorr.Agents.Browser
      "api" -> Tailorr.Agents.Api
      "auth" -> Tailorr.Agents.Auth
      "mock" -> Tailorr.Agents.Mock
      _ -> Tailorr.Agents.Http
    end
  end
end
