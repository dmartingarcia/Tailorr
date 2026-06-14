defmodule Tailorr.Agents.Api do
  @moduledoc """
  Agent for trackers that expose a structured API (REST, JSON, or XML/RSS).

  Many indexers publish a Torznab or Newznab-compatible API themselves —
  this agent acts as a thin passthrough + normalizer for those cases,
  avoiding the need to scrape HTML at all.

  Also supports custom JSON APIs that return search results in a
  tracker-specific format, normalized via a `response_mapping` in the YAML.

  ## YAML config keys
      agent: api
      base_url: "https://api-tracker.com"
      api_key: "your_api_key"           # can also be in secrets.yml
      api_format: torznab               # torznab | newznab | json | rss
      search_path: "/api/search"
      method: GET                       # GET | POST
      headers:
        X-Api-Key: "your_api_key"
      response_mapping:                 # only for api_format: json
        results_key: "data.torrents"
        title_key: "name"
        size_key: "size_bytes"
        seeders_key: "seeds"
        leechers_key: "leeches"
        download_url_key: "torrent_url"
        info_hash_key: "hash"
      timeout_ms: 10000
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.{Result, SearchQuery, Normalizer}

  @impl true
  def capabilities, do: [:search, :test_connection, :structured_api]

  @impl true
  def search(config, %SearchQuery{} = query) do
    url = build_url(config, query)
    headers = build_headers(config)
    format = Map.get(config, "api_format", "json")

    with {:ok, response} <- execute_request(config, url, headers),
         {:ok, raw} <- extract_body(response),
         {:ok, results} <- parse_response(raw, format, config) do
      {:ok, results}
    end
  end

  @impl true
  def test_connection(config) do
    url = config["base_url"]
    headers = build_headers(config)
    timeout = Map.get(config, "timeout_ms", 10_000)

    case Req.get(url, headers: headers, receive_timeout: timeout) do
      {:ok, %{status: s}} when s in 200..299 -> :ok
      {:ok, %{status: s}} -> {:error, {:http_error, s}}
      {:error, r} -> {:error, r}
    end
  end

  # --- Private ---

  defp execute_request(config, url, headers) do
    timeout = Map.get(config, "timeout_ms", 10_000)

    case Map.get(config, "method", "GET") do
      "POST" -> Req.post(url, headers: headers, receive_timeout: timeout)
      _ -> Req.get(url, headers: headers, receive_timeout: timeout)
    end
  end

  defp extract_body({:ok, %{status: 200, body: body}}), do: {:ok, body}
  defp extract_body({:ok, %{status: s}}), do: {:error, {:http_error, s}}
  defp extract_body({:error, r}), do: {:error, r}

  defp parse_response(body, "torznab", _config), do: Normalizer.from_torznab_xml(body)
  defp parse_response(body, "newznab", _config), do: Normalizer.from_newznab_xml(body)
  defp parse_response(body, "rss", _config), do: Normalizer.from_rss(body)
  defp parse_response(body, "json", config), do: Normalizer.from_json(body, config["response_mapping"])

  defp build_url(config, query) do
    base = config["base_url"]
    path = config["search_path"] || "/api/search"
    params = SearchQuery.to_params(query, config)

    api_key = config["api_key"] || System.get_env("TRACKER_API_KEY_#{slug(config)}")
    params = if api_key, do: Map.put(params, "apikey", api_key), else: params

    "#{base}#{path}?#{URI.encode_query(params)}"
  end

  defp build_headers(config) do
    base = %{"Accept" => "application/json, text/xml, application/xml"}
    Map.merge(base, Map.get(config, "headers", %{}))
  end

  defp slug(config) do
    config
    |> Map.get("id", "unknown")
    |> String.upcase()
    |> String.replace(~r/[^A-Z0-9]/, "_")
  end
end
