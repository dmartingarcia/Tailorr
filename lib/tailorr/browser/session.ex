defmodule Tailorr.Browser.Session do
  @moduledoc """
  Represents a browser session.

  SRP: Pure data structure for session state.
  """

  @type t :: %__MODULE__{
          id: String.t(),
          created_at: DateTime.t(),
          last_activity_at: DateTime.t() | nil
        }

  defstruct [:id, :created_at, :last_activity_at]

  @doc """
  Create a new session struct.
  """
  def new(id) do
    %__MODULE__{
      id: id,
      created_at: DateTime.utc_now(),
      last_activity_at: nil
    }
  end

  @doc """
  Mark session as active.
  """
  def touch(%__MODULE__{} = session) do
    %{session | last_activity_at: DateTime.utc_now()}
  end
end
