defmodule Tailorr.Trackers.Supervisor do
  @moduledoc """
  DynamicSupervisor for tracker processes.

  On startup, loads all tracker definitions and spawns a Tracker GenServer
  for each enabled tracker. Trackers can be added/removed dynamically.
  """

  use DynamicSupervisor
  require Logger

  alias Tailorr.{TrackerLoader, Trackers.Tracker}

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @doc """
  Start all trackers from YAML definitions.
  """
  def start_all_trackers do
    trackers = TrackerLoader.load_all()

    Enum.each(trackers, fn {_id, config} ->
      start_tracker(config)
    end)
  end

  @doc """
  Start a single tracker.
  """
  def start_tracker(config) do
    tracker_id = config["id"]

    # Only start if enabled
    if Map.get(config, "enabled", false) do
      child_spec = {Tracker, config}

      case DynamicSupervisor.start_child(__MODULE__, child_spec) do
        {:ok, _pid} ->
          Logger.info("Started tracker: #{tracker_id}")
          :ok

        {:error, {:already_started, _pid}} ->
          Logger.debug("Tracker already running: #{tracker_id}")
          :ok

        {:error, reason} ->
          Logger.error("Failed to start tracker #{tracker_id}: #{inspect(reason)}")
          {:error, reason}
      end
    else
      Logger.info("Skipping disabled tracker: #{tracker_id}")
      :ok
    end
  end

  @doc """
  Stop a tracker.
  """
  def stop_tracker(tracker_id) do
    case Registry.lookup(Tailorr.Trackers.Registry, tracker_id) do
      [{pid, _}] ->
        DynamicSupervisor.terminate_child(__MODULE__, pid)

      [] ->
        {:error, :not_found}
    end
  end

  @doc """
  List all running trackers.
  """
  def list_trackers do
    DynamicSupervisor.which_children(__MODULE__)
    |> Enum.map(fn {_, pid, _, _} -> pid end)
  end

  @impl true
  def init(_init_arg) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end
end
