defmodule Tailorr.Application do
  @moduledoc false

  use Application

  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      # Registry for tracker processes
      {Registry, keys: :unique, name: Tailorr.Trackers.Registry},

      # Cache
      {Cachex, name: :tailorr_cache},

      # Repo (database)
      Tailorr.Repo,

      # Tracker supervisor
      Tailorr.Trackers.Supervisor

      # TODO: Add Oban when we need background jobs
      # {Oban, Application.fetch_env!(:tailorr, Oban)}

      # TODO: Add Phoenix endpoint when we add web layer
      # TailorrWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Tailorr.Supervisor]

    case Supervisor.start_link(children, opts) do
      {:ok, pid} ->
        # Start all trackers after supervision tree is up
        :ok = Tailorr.Trackers.Supervisor.start_all_trackers()
        {:ok, pid}

      {:error, reason} = error ->
        Logger.error("Failed to start application: #{inspect(reason)}")
        error
    end
  end
end
