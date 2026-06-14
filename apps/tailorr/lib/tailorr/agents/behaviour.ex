defmodule Tailorr.Agents.Behaviour do
  @moduledoc """
  Contract that every tracker agent must implement.

  An agent is responsible for:
    1. Fetching search results from a single tracker source
    2. Normalizing them into `Tailorr.Result` structs
    3. Verifying it can reach the tracker (`test_connection/1`)

  Config is a plain map populated from the tracker's YAML definition.
  The agent does NOT own state — state lives in the Tracker.GenServer.
  """

  alias Tailorr.{Result, SearchQuery}

  @doc """
  Search the tracker for the given query. Returns a list of results
  or an error tuple describing the failure reason.
  """
  @callback search(config :: map(), query :: SearchQuery.t()) ::
              {:ok, [Result.t()]} | {:error, reason :: term()}

  @doc """
  Verify connectivity and authentication (if applicable) for the tracker.
  Called on startup and periodically for health checks.
  """
  @callback test_connection(config :: map()) ::
              :ok | {:error, reason :: term()}

  @doc """
  Return the capabilities this agent supports. Used to validate
  tracker YAML definitions at load time.
  """
  @callback capabilities() :: [atom()]
end
