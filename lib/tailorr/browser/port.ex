defmodule Tailorr.Browser.Port do
  @moduledoc """
  GenServer that manages browser sessions via HTTP calls to Node.js service.

  SRP: Only handles browser ↔ Elixir bridge, no business logic.

  The Node.js service runs Playwright and exposes HTTP endpoints for:
  - Creating/destroying sessions
  - Navigating to URLs
  - Clicking coordinates → extracting CSS selectors
  - Capturing screenshots
  """
  use GenServer

  require Logger

  @browser_url Application.compile_env(:tailorr, :browser_url, "http://localhost:3001")

  # Client API

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc """
  Create a new browser session.

  Returns {:ok, session_id} or {:error, reason}.
  """
  def create_session do
    GenServer.call(__MODULE__, :create_session, 30_000)
  end

  @doc """
  Navigate to URL in session.

  Returns {:ok, screenshot_base64} or {:error, reason}.
  """
  def navigate(session_id, url) do
    GenServer.call(__MODULE__, {:navigate, session_id, url}, 30_000)
  end

  @doc """
  Click at coordinates and extract CSS selector.

  Returns {:ok, %{selector: ..., text: ...}} or {:error, reason}.
  """
  def click(session_id, x, y) do
    GenServer.call(__MODULE__, {:click, session_id, x, y}, 10_000)
  end

  @doc """
  Close browser session.
  """
  def close_session(session_id) do
    GenServer.call(__MODULE__, {:close_session, session_id})
  end

  @doc """
  Navigate to URL and return page HTML content.

  Returns {:ok, html} or {:error, reason}.
  """
  def navigate_and_extract(session_id, url) do
    GenServer.call(__MODULE__, {:navigate_and_extract, session_id, url}, 60_000)
  end

  @doc """
  Test connection to the browser service by creating and closing a session.
  """
  def test_connection(_config) do
    case create_session() do
      {:ok, session_id} ->
        close_session(session_id)
        :ok

      {:error, _} = error ->
        error
    end
  end

  # Server callbacks

  @impl true
  def init(_opts) do
    {:ok, %{sessions: %{}}}
  end

  @impl true
  def handle_call(:create_session, _from, state) do
    case post("/session/create", %{}) do
      {:ok, %{"session_id" => session_id}} ->
        sessions = Map.put(state.sessions, session_id, DateTime.utc_now())
        {:reply, {:ok, session_id}, %{state | sessions: sessions}}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call({:navigate, session_id, url}, _from, state) do
    result = post("/session/#{session_id}/navigate", %{url: url})
    {:reply, result, state}
  end

  @impl true
  def handle_call({:click, session_id, x, y}, _from, state) do
    result = post("/session/#{session_id}/click", %{x: x, y: y})
    {:reply, result, state}
  end

  @impl true
  def handle_call({:navigate_and_extract, session_id, url}, _from, state) do
    result =
      case post("/session/#{session_id}/navigate", %{url: url, return_html: true}) do
        {:ok, %{"html" => html}} -> {:ok, html}
        {:ok, _response} -> {:error, :no_html_in_response}
        error -> error
      end

    {:reply, result, state}
  end

  @impl true
  def handle_call({:close_session, session_id}, _from, state) do
    case delete("/session/#{session_id}") do
      {:ok, _} ->
        sessions = Map.delete(state.sessions, session_id)
        {:reply, :ok, %{state | sessions: sessions}}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  # HTTP helpers

  defp post(path, body) do
    url = @browser_url <> path

    case Req.post(url, json: body) do
      {:ok, %{status: 200, body: response}} ->
        {:ok, response}

      {:ok, %{status: status, body: body}} ->
        Logger.error("Browser service error: #{status} - #{inspect(body)}")
        {:error, {:http_error, status}}

      {:error, reason} ->
        Logger.error("Browser service request failed: #{inspect(reason)}")
        {:error, :connection_failed}
    end
  end

  defp delete(path) do
    url = @browser_url <> path

    case Req.delete(url) do
      {:ok, %{status: 200}} -> {:ok, :deleted}
      {:ok, %{status: 404}} -> {:ok, :not_found}
      {:error, reason} -> {:error, reason}
    end
  end
end
