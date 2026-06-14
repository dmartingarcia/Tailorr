defmodule Tailorr.Agents.Http do
  @moduledoc """
  Agent for trackers accessible via plain HTTP/HTTPS.

  Handles:
    - Custom request headers (User-Agent, Referer, etc.)
    - Cookie jar (persisted in config, refreshed on 403)
    - Configurable timeouts and retries
    - Gzip / Brotli response decompression (via Req)

  Use this agent for trackers that do NOT use Cloudflare or JS challenges.
  For CF-protected sites, use `Tailorr.Agents.Cloudflare` instead.

  ## YAML config keys
      agent: http
      base_url: "https://example-tracker.com"
      search_path: "/search"          # appended to base_url
      headers:
        User-Agent: "Mozilla/5.0 ..."
        Referer: "https://example-tracker.com"
      encoding: "utf-8"               # response charset (default utf-8)
      timeout_ms: 15000
      retries: 2
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.{Result, SearchQuery, Scraper}

  @default_timeout_ms 15_000
  @default_retries 2

  @impl true
  def capabilities, do: [:search, :test_connection]

  @impl true
  def search(config, %SearchQuery{} = query) do
    url = build_url(config, query)
    headers = build_headers(config)

    case fetch(url, headers, config) do
      {:ok, %{body: body, status: 200}} ->
        results = Scraper.parse(body, config)
        {:ok, results}

      {:ok, %{status: status}} ->
        {:error, {:http_error, status}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @impl true
  def test_connection(config) do
    url = config["base_url"]
    headers = build_headers(config)

    case fetch(url, headers, config) do
      {:ok, %{status: status}} when status in 200..299 -> :ok
      {:ok, %{status: status}} -> {:error, {:http_error, status}}
      {:error, reason} -> {:error, reason}
    end
  end

  # --- Private ---

  defp fetch(url, headers, config) do
    timeout = Map.get(config, "timeout_ms", @default_timeout_ms)
    retries = Map.get(config, "retries", @default_retries)

    Req.get(url,
      headers: headers,
      receive_timeout: timeout,
      retry: :transient,
      max_retries: retries,
      decode_body: true
    )
  end

  defp build_url(config, query) do
    base = config["base_url"]
    path = config["search_path"] || "/search"
    params = SearchQuery.to_params(query, config)
    "#{base}#{path}?#{URI.encode_query(params)}"
  end

  defp build_headers(config) do
    defaults = %{
      "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language" => "en-US,en;q=0.5",
      "Accept-Encoding" => "gzip, deflate, br"
    }

    Map.merge(defaults, Map.get(config, "headers", %{}))
  end
end
