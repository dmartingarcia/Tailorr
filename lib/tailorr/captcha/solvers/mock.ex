defmodule Tailorr.Captcha.Solvers.Mock do
  @moduledoc """
  Mock CAPTCHA solver for testing.

  Always returns a configurable response without actual solving.
  Useful for E2E tests and development.

  ## Options
    - `:solution` - The solution to return (default: "MOCK123")
    - `:delay` - Artificial delay in ms (default: 0)
    - `:error` - Return error instead of success (default: false)
    - `:error_reason` - Error reason when `:error` is true (default: :mock_error)

  ## Examples

      # Success case
      captcha = %{image: "test.png", image_type: :url}
      Mock.solve(captcha, solution: "ABC123")
      #=> {:ok, "ABC123"}

      # Error case
      Mock.solve(captcha, error: true, error_reason: :mock_failure)
      #=> {:error, :mock_failure}

      # With delay
      Mock.solve(captcha, solution: "TEST", delay: 100)
      #=> {:ok, "TEST"} (after 100ms)
  """

  @behaviour Tailorr.Captcha.Solver

  @impl true
  def solve(_captcha_data, opts \\ []) do
    # Artificial delay for testing async behavior
    if delay = Keyword.get(opts, :delay, 0) do
      Process.sleep(delay)
    end

    # Return error if configured
    if Keyword.get(opts, :error, false) do
      reason = Keyword.get(opts, :error_reason, :mock_error)
      {:error, reason}
    else
      solution = Keyword.get(opts, :solution, "MOCK123")
      {:ok, solution}
    end
  end
end
