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

  alias Tailorr.{Scraper, SearchQuery}

  @default_timeout_ms 15_000
  @default_retries 2

  @impl true
  def capabilities, do: [:search, :test_connection]

  @impl true
  def search(config, %SearchQuery{} = query) do
    # Initialize session with cookies if needed
    req = build_req_client(config)

    method = Map.get(config, "search_method", "GET") |> String.upcase()

    result =
      case method do
        "POST" -> fetch_post(req, config, query)
        _ -> fetch_get(req, config, query)
      end

    case result do
      {:ok, %{body: body, status: 200}} ->
        IO.puts("DEBUG HTTP: Received #{byte_size(body)} bytes")
        File.write!("/tmp/tailorr_response.html", body)
        IO.puts("DEBUG HTTP: Saved to /tmp/tailorr_response.html")
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
    timeout = Map.get(config, "timeout_ms", @default_timeout_ms)
    retries = Map.get(config, "retries", @default_retries)

    case Req.get(url,
           headers: headers,
           receive_timeout: timeout,
           retry: :transient,
           max_retries: retries
         ) do
      {:ok, %{status: status}} when status in 200..299 -> :ok
      {:ok, %{status: status}} -> {:error, {:http_error, status}}
      {:error, reason} -> {:error, reason}
    end
  end

  # --- Private ---

  # Build Req client with cookie jar
  defp build_req_client(config) do
    timeout = Map.get(config, "timeout_ms", @default_timeout_ms)
    retries = Map.get(config, "retries", @default_retries)
    headers = build_headers(config)

    # Create client with cookie jar
    req =
      Req.new(
        receive_timeout: timeout,
        retry: :transient,
        max_retries: retries,
        compressed: true,
        decode_body: true,
        headers: headers
      )

    # Visit homepage to get cookies if needed
    if Map.get(config, "needs_cookies", false) do
      base_url = config["base_url"]

      case Req.get(req, url: base_url) do
        {:ok, response} ->
          cookies =
            Req.Response.get_header(response, "set-cookie")
            |> Enum.map(&(String.split(&1, ";") |> List.first()))
            |> Enum.join("; ")

          if cookies != "" do
            Req.merge(req, headers: %{"cookie" => cookies})
          else
            req
          end

        {:error, _} ->
          req
      end
    else
      req
    end
  end

  defp fetch_get(req, config, query) do
    url = build_url(config, query)
    Req.get(req, url: url)
  end

  defp fetch_post(req, config, query) do
    url = build_post_url(config)
    form_data = SearchQuery.to_params(query, config)
    Req.post(req, url: url, form: form_data)
  end

  defp build_post_url(config) do
    base = config["base_url"]
    path = config["search_path"] || "/search"
    "#{base}#{path}"
  end

  defp build_url(config, query) do
    base = config["base_url"]
    raw_path = config["search_path"] || "/search"

    # Replace {query} placeholder in path if present (path-based search)
    path =
      if String.contains?(raw_path, "{query}") do
        String.replace(raw_path, "{query}", URI.encode(query.query))
      else
        raw_path
      end

    params = SearchQuery.to_params(query, config)
    encoded = URI.encode_query(params)

    if encoded == "" do
      "#{base}#{path}"
    else
      "#{base}#{path}?#{encoded}"
    end
  end

  defp build_headers(config) do
    base_url = config["base_url"]

    defaults = %{
      "User-Agent" =>
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language" => "es-ES,es;q=0.9,en;q=0.8",
      "DNT" => "1",
      "Connection" => "keep-alive",
      "Upgrade-Insecure-Requests" => "1",
      "Sec-Fetch-Dest" => "document",
      "Sec-Fetch-Mode" => "navigate",
      "Sec-Fetch-Site" => "none",
      "Cache-Control" => "max-age=0",
      "Referer" => base_url
    }

    Map.merge(defaults, Map.get(config, "headers", %{}))
  end
end
