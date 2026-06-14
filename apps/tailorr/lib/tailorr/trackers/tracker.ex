defmodule Tailorr.Trackers.Tracker do
  @moduledoc """
  GenServer that wraps a tracker agent and manages its state.

  Each tracker is a supervised process. If a search fails, the tracker
  remains running. If the process crashes, the supervisor restarts it.

  State:
  - config: tracker YAML config (id, name, agent type, selectors, etc.)
  - agent_module: the agent implementation module (Http, Cloudflare, etc.)
  - last_search_at: timestamp of last successful search
  - failure_count: consecutive failures (for health monitoring)
  """

  use GenServer
  require Logger

  alias Tailorr.SearchQuery

  # Client API

  @doc """
  Start a tracker GenServer.
  """
  def start_link(config) do
    tracker_id = config["id"]
    GenServer.start_link(__MODULE__, config, name: via_tuple(tracker_id))
  end

  @doc """
  Search this tracker.
  """
  def search(tracker_id, %SearchQuery{} = query) do
    GenServer.call(via_tuple(tracker_id), {:search, query}, 30_000)
  end

  @doc """
  Test connection to this tracker.
  """
  def test_connection(tracker_id) do
    GenServer.call(via_tuple(tracker_id), :test_connection, 30_000)
  end

  @doc """
  Get tracker status and metadata.
  """
  def status(tracker_id) do
    GenServer.call(via_tuple(tracker_id), :status)
  end

  # Server Callbacks

  @impl true
  def init(config) do
    tracker_id = config["id"]
    agent_type = config["agent"]
    agent_module = agent_module(agent_type)

    Logger.info("Starting tracker: #{tracker_id} (agent: #{agent_type})")

    state = %{
      config: config,
      agent_module: agent_module,
      last_search_at: nil,
      failure_count: 0
    }

    {:ok, state}
  end

  @impl true
  def handle_call({:search, query}, _from, state) do
    %{config: config, agent_module: agent_module} = state

    case agent_module.search(config, query) do
      {:ok, results} ->
        new_state = %{state | last_search_at: DateTime.utc_now(), failure_count: 0}
        {:reply, {:ok, results}, new_state}

      {:error, reason} = error ->
        Logger.warning("Search failed for #{config["id"]}: #{inspect(reason)}")
        new_state = %{state | failure_count: state.failure_count + 1}
        {:reply, error, new_state}
    end
  end

  @impl true
  def handle_call(:test_connection, _from, state) do
    %{config: config, agent_module: agent_module} = state

    result = agent_module.test_connection(config)
    {:reply, result, state}
  end

  @impl true
  def handle_call(:status, _from, state) do
    %{config: config, last_search_at: last_search_at, failure_count: failure_count} = state

    status = %{
      id: config["id"],
      name: config["name"],
      agent: config["agent"],
      enabled: Map.get(config, "enabled", true),
      last_search_at: last_search_at,
      failure_count: failure_count,
      healthy: failure_count < 5
    }

    {:reply, status, state}
  end

  # --- Private ---

  defp via_tuple(tracker_id) do
    {:via, Registry, {Tailorr.Trackers.Registry, tracker_id}}
  end

  defp agent_module(agent_type) do
    case agent_type do
      "http" -> Tailorr.Agents.Http
      "cloudflare" -> Tailorr.Agents.Cloudflare
      "browser" -> Tailorr.Agents.Browser
      "api" -> Tailorr.Agents.Api
      "auth" -> Tailorr.Agents.Auth
      _ -> Tailorr.Agents.Http
    end
  end
end
