defmodule TailorrWeb.ConnCase do
  @moduledoc """
  Test case template for Phoenix controller and LiveView tests.

  Sets up a connection and imports helpers for controller tests
  and Phoenix.LiveViewTest for LiveView tests.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      import Plug.Conn
      import Phoenix.ConnTest
      import Phoenix.LiveViewTest

      @endpoint TailorrWeb.Endpoint
    end
  end

  setup _tags do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
