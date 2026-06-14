defmodule TailorrWeb.Application do
  @moduledoc """
  The TailorrWeb Application supervises the Phoenix endpoint.

  SRP: Only responsible for starting the web layer supervision tree.
  """
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Telemetry supervisor
      TailorrWeb.Telemetry,
      # Phoenix endpoint
      TailorrWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: TailorrWeb.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    TailorrWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
