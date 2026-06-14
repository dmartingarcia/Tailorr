defmodule TailorrWeb.Layouts do
  @moduledoc """
  Layout components for TailorrWeb.

  This module contains the root and app layout templates.
  """
  use TailorrWeb, :html

  embed_templates("layouts/*")
end
