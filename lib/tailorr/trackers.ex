defmodule Tailorr.Trackers do
  @moduledoc """
  Public API for tracker operations.

  Provides high-level functions for:
  - Listing trackers
  - Searching single or multiple trackers
  - Getting tracker definitions
  - Managing tracker state

  SRP: Only exposes public API. Implementation details delegated to Tracker GenServers.
  DIP: Callers depend on this interface, not on Tracker internals.
  """

  alias Tailorr.SearchQuery
  alias Tailorr.Trackers.{Supervisor, Tracker}

  require Logger

  @doc """
  List all registered trackers.

  Returns a list of tracker metadata maps.

  ## Examples

      iex> Trackers.list_all()
      [%{id: "nyaa", name: "Nyaa", agent: "http", enabled: true}, ...]
  """
  def list_all do
    Supervisor.list_trackers()
    |> Enum.map(&get_tracker_info/1)
    |> Enum.filter(& &1)
  end

  @doc """
  Search a single tracker by ID.

  Returns {:ok, results} or {:error, reason}.

  ## Examples

      iex> Trackers.search("nyaa", "ubuntu")
      {:ok, [%Tailorr.Result{title: "Ubuntu 22.04", ...}]}
  """
  def search(tracker_id, query) when is_binary(query) do
    search_query = SearchQuery.new(query)
    search(tracker_id, search_query)
  end

  def search(tracker_id, %SearchQuery{} = query) do
    results = Tracker.search(tracker_id, query)
    {:ok, results}
  catch
    :exit, {:noproc, _} ->
      {:error, :tracker_not_found}

    :exit, {:timeout, _} ->
      {:error, :timeout}

    kind, reason ->
      Logger.error("Search failed for #{tracker_id}: #{inspect({kind, reason})}")
      {:error, :search_failed}
  end

  @doc """
  Search all enabled trackers.

  Returns a flat list of results from all trackers.

  ## Examples

      iex> Trackers.search_all("ubuntu")
      [%Tailorr.Result{tracker_id: "nyaa", title: "Ubuntu..."}, ...]
  """
  def search_all(query) when is_binary(query) do
    search_query = SearchQuery.new(query)

    list_all()
    |> Enum.filter(& &1.enabled)
    |> Task.async_stream(
      fn tracker ->
        case search(tracker.id, search_query) do
          {:ok, results} -> results
          {:error, _reason} -> []
        end
      end,
      timeout: 30_000,
      max_concurrency: 10
    )
    |> Enum.flat_map(fn
      {:ok, results} -> results
      {:exit, _reason} -> []
    end)
  end

  @doc """
  Get a tracker definition by ID.

  Returns {:ok, config} or {:error, :not_found}.

  ## Examples

      iex> Trackers.get_definition("nyaa")
      {:ok, %{"id" => "nyaa", "name" => "Nyaa", ...}}
  """
  def get_definition(tracker_id) do
    case Tracker.status(tracker_id) do
      {:ok, status} -> {:ok, status.config}
      {:error, _} = error -> error
    end
  catch
    :exit, {:noproc, _} -> {:error, :not_found}
  end

  @doc """
  Test connection to a tracker.

  Returns :ok or {:error, reason}.

  ## Examples

      iex> Trackers.test_connection("nyaa")
      :ok
  """
  def test_connection(tracker_id) do
    Tracker.test_connection(tracker_id)
  catch
    :exit, {:noproc, _} -> {:error, :tracker_not_found}
  end

  @doc """
  Manually reset the circuit breaker for a tracker to :closed state.
  """
  def reset_circuit(tracker_id) do
    Tracker.reset_circuit(tracker_id)
  catch
    :exit, {:noproc, _} -> {:error, :tracker_not_found}
  end

  # Private helpers

  defp get_tracker_info(tracker_id) do
    case Tracker.status(tracker_id) do
      {:ok, status} ->
        %{
          id: tracker_id,
          name: status.config["name"] || tracker_id,
          agent: status.config["agent"] || "http",
          enabled: status.config["enabled"] != false,
          last_search_at: status.last_search_at,
          failure_count: status.failure_count,
          circuit_state: status.circuit_state,
          circuit_opened_at: status.circuit_opened_at,
          circuit_threshold: status.circuit_threshold,
          circuit_reset_ms: status.circuit_reset_ms
        }

      {:error, _} ->
        nil
    end
  catch
    :exit, _ -> nil
  end
end
