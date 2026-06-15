defmodule Tailorr.Agents.Browser do
  @moduledoc """
  Agent for trackers that require full JavaScript execution beyond what
  FlareSolverr handles — e.g. sites with custom anti-bot fingerprinting,
  canvas challenges, dynamic pagination, or heavy single-page-app rendering.

  Implementation options (configured via `driver` key):
    - `:flaresolverr` (default) — reuses the FlareSolverr sidecar; works for most cases
    - `:port` — communicates with a Node.js/Playwright process via an Erlang Port;
       gives full programmatic browser control (click, type, scroll, screenshot)

  The `:port` driver is heavier but necessary for:
    - Multi-step login flows
    - CAPTCHA-solving integrations (2captcha, Anti-Captcha)
    - Sites that detect and block headless browsers by fingerprint

  ## YAML config keys
      agent: browser
      base_url: "https://complex-tracker.com"
      search_path: "/search"
      driver: flaresolverr              # or: port
      wait_for_selector: ".results"     # CSS selector to wait for before scraping
      scroll_to_bottom: false           # scroll to trigger lazy-load
      screenshot_on_error: true         # save screenshot on failure (for debugging)
      max_timeout_ms: 90000
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.Agents.Cloudflare
  alias Tailorr.Browser.Port, as: BrowserPort
  alias Tailorr.Scraper
  alias Tailorr.SearchQuery

  @impl true
  def capabilities, do: [:search, :test_connection, :javascript, :screenshot]

  @impl true
  def search(config, %SearchQuery{} = query) do
    case driver(config) do
      :flaresolverr -> Cloudflare.search(config, query)
      :port -> port_search(config, query)
    end
  end

  @impl true
  def test_connection(config) do
    case driver(config) do
      :flaresolverr ->
        Cloudflare.test_connection(config)

      :port ->
        BrowserPort.test_connection(config)
    end
  catch
    :exit, {:noproc, _} -> {:error, :browser_service_unavailable}
  end

  # --- Private ---

  defp port_search(config, query) do
    url = build_search_url(config, query)
    opts = browser_opts(config)

    case BrowserPort.navigate_and_extract(url, opts) do
      {:ok, html} ->
        results = Scraper.parse(html, config)
        {:ok, results}

      {:error, _} = err ->
        err
    end
  catch
    :exit, {:noproc, _} -> {:error, :browser_service_unavailable}
    :exit, {:timeout, _} -> {:error, :timeout}
  end

  defp driver(config) do
    case Map.get(config, "driver", "flaresolverr") do
      "port" -> :port
      _ -> :flaresolverr
    end
  end

  defp browser_opts(config) do
    %{
      wait_for: Map.get(config, "wait_for_selector"),
      scroll_to_bottom: Map.get(config, "scroll_to_bottom", false),
      screenshot_on_error: Map.get(config, "screenshot_on_error", true),
      timeout_ms: Map.get(config, "max_timeout_ms", 90_000)
    }
  end

  defp build_search_url(config, query) do
    base = config["base_url"]
    path = config["search_path"] || "/search"
    params = SearchQuery.to_params(query, config)
    "#{base}#{path}?#{URI.encode_query(params)}"
  end
end
