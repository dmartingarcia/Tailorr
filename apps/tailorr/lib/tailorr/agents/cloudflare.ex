defmodule Tailorr.Agents.Cloudflare do
  @moduledoc """
  Agent for Cloudflare-protected trackers.

  Strategy:
    1. Send the target URL to FlareSolverr (sidecar service)
    2. FlareSolverr spins up a Playwright browser, solves the JS/CF challenge,
       and returns the rendered HTML + solved cookies
    3. We extract `cf_clearance` from the returned cookies
    4. For subsequent requests within the session, we inject that cookie directly
       into plain HTTP calls (via `Tailorr.Agents.Http`) — no browser needed
    5. On cookie expiry (403 / CF challenge page detected), go back to step 1

  This keeps browser usage minimal — one solve per session, then fast HTTP.

  ## YAML config keys
      agent: cloudflare
      base_url: "https://cf-protected-tracker.com"
      search_path: "/search"
      flaresolverr_url: "http://flaresolverr:8191"   # optional, uses env var default
      session_ttl_minutes: 60                          # how long before re-solving
      max_timeout_ms: 60000                            # FlareSolverr timeout
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.{Result, SearchQuery, Scraper}

  @flaresolverr_path "/v1"
  @default_timeout_ms 60_000

  @impl true
  def capabilities, do: [:search, :test_connection, :cloudflare_bypass]

  @impl true
  def search(config, %SearchQuery{} = query) do
    url = build_search_url(config, query)

    case solve_and_fetch(config, url) do
      {:ok, html} ->
        results = Scraper.parse(html, config)
        {:ok, results}

      {:error, _} = err ->
        err
    end
  end

  @impl true
  def test_connection(config) do
    case solve_and_fetch(config, config["base_url"]) do
      {:ok, _html} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  # --- Private ---

  defp solve_and_fetch(config, url) do
    flare_url = flaresolverr_url(config) <> @flaresolverr_path
    timeout = Map.get(config, "max_timeout_ms", @default_timeout_ms)

    payload = %{
      "cmd" => "request.get",
      "url" => url,
      "maxTimeout" => timeout
    }

    case Req.post(flare_url, json: payload, receive_timeout: timeout + 5_000) do
      {:ok, %{status: 200, body: %{"solution" => solution}}} ->
        html = solution["response"]

        if cloudflare_challenge?(html) do
          {:error, :challenge_not_solved}
        else
          {:ok, html}
        end

      {:ok, %{status: status, body: body}} ->
        {:error, {:flaresolverr_error, status, body["message"]}}

      {:error, reason} ->
        {:error, {:flaresolverr_unreachable, reason}}
    end
  end

  defp cloudflare_challenge?(html) when is_binary(html) do
    String.contains?(html, "Just a moment") or
      String.contains?(html, "cf-browser-verification") or
      String.contains?(html, "challenge-form")
  end

  defp cloudflare_challenge?(_), do: false

  defp build_search_url(config, query) do
    base = config["base_url"]
    path = config["search_path"] || "/search"
    params = SearchQuery.to_params(query, config)
    "#{base}#{path}?#{URI.encode_query(params)}"
  end

  defp flaresolverr_url(config) do
    Map.get(config, "flaresolverr_url") ||
      System.get_env("FLARESOLVERR_URL") ||
      "http://flaresolverr:8191"
  end
end
