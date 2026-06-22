defmodule Tailorr.Trackers.Tracker do
  @moduledoc """
  GenServer that wraps a tracker agent and manages its lifecycle.

  Implements a per-tracker circuit breaker with three states:
    :closed    — normal operation, calls agent on every search
    :open      — too many consecutive failures; rejects immediately without calling agent
    :half_open — cooldown elapsed; allows one probe request through to test recovery

  Circuit breaker thresholds are configurable per tracker in the YAML definition:

      circuit_breaker:
        threshold: 5        # consecutive failures before opening (default: 5)
        reset_after_s: 60   # seconds before moving to half_open (default: 60)

  On success: always resets to :closed and zeroes failure_count.
  On failure in :half_open: returns to :open immediately.
  """

  use GenServer
  require Logger

  alias Tailorr.SearchQuery

  @default_threshold 5
  @default_reset_s 60

  # Client API

  def start_link(config) do
    GenServer.start_link(__MODULE__, config, name: via_tuple(config["id"]))
  end

  def search(tracker_id, %SearchQuery{} = query) do
    GenServer.call(via_tuple(tracker_id), {:search, query}, 90_000)
  end

  def test_connection(tracker_id) do
    GenServer.call(via_tuple(tracker_id), :test_connection, 90_000)
  end

  def status(tracker_id) do
    GenServer.call(via_tuple(tracker_id), :status)
  end

  def reset_circuit(tracker_id) do
    GenServer.call(via_tuple(tracker_id), :reset_circuit)
  end

  # Server Callbacks

  @impl true
  def init(config) do
    cb = Map.get(config, "circuit_breaker", %{})
    threshold = Map.get(cb, "threshold", @default_threshold)
    reset_ms = Map.get(cb, "reset_after_s", @default_reset_s) * 1_000

    Logger.info("Starting tracker: #{config["id"]} (agent: #{config["agent"]})")

    {:ok,
     %{
       config: config,
       agent_module: agent_module(config["agent"]),
       last_search_at: nil,
       failure_count: 0,
       circuit_state: :closed,
       circuit_opened_at: nil,
       circuit_threshold: threshold,
       circuit_reset_ms: reset_ms
     }}
  end

  @impl true
  def handle_call({:search, query}, _from, state) do
    case check_circuit(state) do
      {:open, state} ->
        {:reply, {:error, :circuit_open}, state}

      {:available, state} ->
        case state.agent_module.search(state.config, query) do
          {:ok, results} ->
            {:reply, {:ok, results}, on_success(state)}

          {:error, reason} = error ->
            Logger.warning("Search failed for #{state.config["id"]}: #{inspect(reason)}")
            {:reply, error, record_failure(state)}
        end
    end
  end

  @impl true
  def handle_call(:test_connection, _from, state) do
    {:reply, state.agent_module.test_connection(state.config), state}
  end

  @impl true
  def handle_call(:reset_circuit, _from, state) do
    Logger.info("Circuit breaker manually reset for #{state.config["id"]}")

    {:reply, :ok,
     %{state | circuit_state: :closed, failure_count: 0, circuit_opened_at: nil}}
  end

  @impl true
  def handle_call(:status, _from, state) do
    status = %{
      config: state.config,
      id: state.config["id"],
      name: state.config["name"],
      agent: state.config["agent"],
      enabled: Map.get(state.config, "enabled", true),
      last_search_at: state.last_search_at,
      failure_count: state.failure_count,
      circuit_state: state.circuit_state,
      circuit_opened_at: state.circuit_opened_at,
      circuit_threshold: state.circuit_threshold,
      circuit_reset_ms: state.circuit_reset_ms,
      healthy: state.circuit_state == :closed
    }

    {:reply, {:ok, status}, state}
  end

  # Private

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
      "mock" -> Tailorr.Agents.Mock
      _ -> Tailorr.Agents.Http
    end
  end

  defp check_circuit(%{circuit_state: state} = s) when state in [:closed, :half_open] do
    {:available, s}
  end

  defp check_circuit(%{circuit_state: :open} = state) do
    elapsed_ms = DateTime.diff(DateTime.utc_now(), state.circuit_opened_at, :millisecond)

    if elapsed_ms >= state.circuit_reset_ms do
      Logger.info("Circuit breaker → half_open for #{state.config["id"]}")
      {:available, %{state | circuit_state: :half_open}}
    else
      {:open, state}
    end
  end

  defp on_success(state) do
    %{state | last_search_at: DateTime.utc_now(), failure_count: 0, circuit_state: :closed, circuit_opened_at: nil}
  end

  defp record_failure(%{failure_count: count, circuit_threshold: threshold} = state) do
    new_count = count + 1

    if new_count >= threshold do
      Logger.warning("Circuit breaker OPEN for #{state.config["id"]} after #{new_count} failures")
      %{state | failure_count: new_count, circuit_state: :open, circuit_opened_at: DateTime.utc_now()}
    else
      %{state | failure_count: new_count, circuit_state: :closed}
    end
  end
end
