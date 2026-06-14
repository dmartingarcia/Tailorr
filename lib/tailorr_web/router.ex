defmodule TailorrWeb.Router do
  @moduledoc """
  Phoenix Router for TailorrWeb.

  Defines two pipelines:
  - :browser - For LiveView UIs
  - :api - For Torznab/Newznab XML/JSON APIs

  SRP: Only handles routing and pipeline composition.
  Business logic lives in controllers and LiveViews.
  """
  use TailorrWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, html: {TailorrWeb.Layouts, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json", "xml"])
  end

  # LiveDashboard (only in development)
  if Application.compile_env(:tailorr_web, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through(:browser)

      live_dashboard("/dashboard", metrics: TailorrWeb.Telemetry)
    end
  end

  # API endpoints (Torznab/Newznab)
  scope "/api", TailorrWeb do
    pipe_through(:api)

    get("/", TorznabController, :index)
  end

  # LiveView UIs
  scope "/ui", TailorrWeb do
    pipe_through(:browser)

    live("/builder", TrackerBuilder.BuilderLive, :index)
    live("/builder/:tracker_id", TrackerBuilder.BuilderLive, :edit)
    live("/test", TrackerTest.TestLive, :index)
  end

  # Redirect root to test UI
  scope "/", TailorrWeb do
    pipe_through(:browser)

    live("/", TrackerTest.TestLive, :index)
  end
end
