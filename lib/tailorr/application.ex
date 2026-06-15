defmodule Tailorr.Application do
  @moduledoc """
  The Tailorr Application.

  Starts all supervision trees for:
  - Core tracker system (Registry, Trackers.Supervisor)
  - Database (Repo)
  - Cache (Cachex)
  - Web layer (Phoenix Endpoint, Telemetry)
  - PubSub for LiveView
  """

  use Application

  require Logger

  @impl true
  def start(_type, _args) do
    children =
      [
        # Registry for tracker processes
        {Registry, keys: :unique, name: Tailorr.Trackers.Registry},

        # PubSub for LiveView and real-time features
        {Phoenix.PubSub, name: Tailorr.PubSub},

        # Cache
        {Cachex, name: :tailorr_cache},

        # Repo (database)
        Tailorr.Repo,

        # Tracker supervisor
        Tailorr.Trackers.Supervisor,

        # Web layer
        TailorrWeb.Telemetry,
        TailorrWeb.Endpoint

        # {Oban, Application.fetch_env!(:tailorr, Oban)}
      ] ++ telegram_children()

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

  @doc """
  Tell Phoenix to update the endpoint configuration whenever the application is updated.
  """
  @impl true
  def config_change(changed, _new, removed) do
    TailorrWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp telegram_children do
    bot_token =
      System.get_env("TELEGRAM_BOT_TOKEN") ||
        Application.get_env(:tailorr, :telegram_captcha, [])[:bot_token]

    if bot_token do
      [{Tailorr.Captcha.Solvers.Telegram.Bot, [bot_token: bot_token]}]
    else
      []
    end
  end
end
