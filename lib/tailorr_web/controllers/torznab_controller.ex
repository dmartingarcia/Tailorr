defmodule TailorrWeb.TorznabController do
  use TailorrWeb, :controller

  alias Tailorr.{SearchQuery, Torznab, TrackerLoader, Trackers}
  require Logger

  plug(:authenticate_api_key)

  @doc """
  Main Torznab API endpoint.

  Supports:
  - t=search: Search across trackers
  - t=caps: Return capabilities
  - q: Query string
  - apikey: API key for authentication (required)
  - tracker: Comma-separated list of tracker IDs (optional, default: all enabled)
  - cat: Category filter (TODO)
  - limit: Max results per tracker (default: 100)

  ## Examples

      GET /api?t=search&q=matrix&apikey=YOUR_KEY
      GET /api?t=search&q=matrix&tracker=dontorrent&apikey=YOUR_KEY
      GET /api?t=search&q=matrix&tracker=dontorrent,mejortorrent&limit=50&apikey=YOUR_KEY
      GET /api?t=caps&apikey=YOUR_KEY

  """
  def index(conn, params) do
    case params["t"] do
      "caps" -> capabilities(conn)
      "search" -> search(conn, params)
      _ -> error(conn, "Invalid or missing 't' parameter")
    end
  end

  # Authenticate API key from query params or header
  defp authenticate_api_key(conn, _opts) do
    api_key = conn.params["apikey"] || get_req_header(conn, "x-api-key") |> List.first()
    valid_keys = Application.get_env(:tailorr, :api_keys, [])

    cond do
      valid_keys == [] ->
        # No API keys configured - allow all
        conn

      api_key in valid_keys ->
        conn

      true ->
        conn
        |> error("Invalid or missing API key")
        |> halt()
    end
  end

  defp search(conn, params) do
    query_text = params["q"] || ""
    tracker_ids = parse_trackers(params["tracker"])
    limit = params["limit"] || "100"

    if query_text == "" do
      error(conn, "Missing 'q' parameter")
    else
      Logger.info("Torznab search: q=#{query_text}, trackers=#{inspect(tracker_ids)}")

      # Create search query
      query = %SearchQuery{query: query_text}

      # Search all selected trackers
      results =
        tracker_ids
        |> Enum.flat_map(fn tracker_id ->
          search_tracker(tracker_id, query)
        end)
        |> Enum.take(String.to_integer(limit))

      # Build Torznab XML
      xml = Torznab.build_feed(results, query_text)

      conn
      |> put_resp_content_type("application/rss+xml")
      |> send_resp(200, xml)
    end
  end

  defp search_tracker(tracker_id, query) do
    case Trackers.Tracker.search(tracker_id, query) do
      {:ok, results} ->
        Logger.debug("Tracker #{tracker_id}: #{length(results)} results")
        results

      {:error, :circuit_open} ->
        Logger.info("Tracker #{tracker_id}: circuit open, skipped")
        []

      {:error, reason} ->
        Logger.warning("Tracker #{tracker_id} failed: #{inspect(reason)}")
        []
    end
  end

  defp parse_trackers(nil) do
    # No tracker specified - use all enabled trackers
    TrackerLoader.load_all()
    |> Enum.filter(fn {_id, config} -> config["enabled"] end)
    |> Enum.map(fn {id, _config} -> id end)
  end

  defp parse_trackers(tracker_param) when is_binary(tracker_param) do
    tracker_param
    |> String.split(",", trim: true)
    |> Enum.map(&String.trim/1)
  end

  defp capabilities(conn) do
    # Torznab capabilities XML - placeholder implementation
    xml = """
    <?xml version="1.0" encoding="UTF-8"?>
    <caps>
      <server title="Tailorr" version="1.0"/>
      <searching>
        <search available="yes" supportedParams="q"/>
      </searching>
    </caps>
    """

    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(200, xml)
  end

  defp error(conn, message) do
    xml = """
    <?xml version="1.0" encoding="UTF-8"?>
    <error code="200" description="#{message}"/>
    """

    conn
    |> put_resp_content_type("application/xml")
    |> send_resp(400, xml)
  end
end
