defmodule TailorrWeb.ErrorHTML do
  @moduledoc """
  Error views for HTML responses.
  """
  use TailorrWeb, :html

  embed_templates("error_html/*")

  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end
