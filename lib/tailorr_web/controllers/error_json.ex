defmodule TailorrWeb.ErrorJSON do
  @moduledoc """
  Error views for JSON responses.
  """

  def render(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end
end
