defmodule Tailorr.Browser do
  @moduledoc """
  Public API for browser operations.

  DIP: LiveView depends on this interface, not on Port implementation.
  Allows mocking in tests via compile-time config.

  ## Configuration

  In config/test.exs:

      config :tailorr, :browser_adapter, Tailorr.Browser.Mock
  """

  alias Tailorr.Browser.{Port, Session}

  @doc """
  Start a new browser session.

  Returns {:ok, %Session{}} or {:error, reason}.

  ## Examples

      iex> Browser.new_session()
      {:ok, %Session{id: "abc123", ...}}
  """
  def new_session do
    case Port.create_session() do
      {:ok, session_id} -> {:ok, Session.new(session_id)}
      {:error, _} = error -> error
    end
  end

  @doc """
  Navigate to URL and return screenshot.

  Returns {:ok, screenshot_base64} or {:error, reason}.

  ## Examples

      iex> Browser.navigate(session, "https://example.com")
      {:ok, "data:image/png;base64,..."}
  """
  def navigate(%Session{} = session, url) do
    case Port.navigate(session.id, url) do
      {:ok, %{"screenshot" => screenshot}} -> {:ok, screenshot}
      {:error, _} = error -> error
    end
  end

  @doc """
  Click at coordinates and extract CSS selector.

  Returns {:ok, %{selector: ..., text: ...}} or {:error, reason}.

  ## Examples

      iex> Browser.click_element(session, 100, 200)
      {:ok, %{selector: "td.title a", text: "Example Title"}}
  """
  def click_element(%Session{} = session, x, y) do
    Port.click(session.id, x, y)
  end

  @doc """
  Clean up browser session.

  ## Examples

      iex> Browser.close_session(session)
      :ok
  """
  def close_session(%Session{} = session) do
    Port.close_session(session.id)
  end
end
