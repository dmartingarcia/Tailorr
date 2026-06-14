defmodule Tailorr.Captcha.Solver do
  @moduledoc """
  Behaviour for CAPTCHA solving backends.

  All solver implementations must implement `solve/2` which takes captcha data
  and options, returning `{:ok, solution}` or `{:error, reason}`.
  """

  @type captcha_data :: %{
          image: binary() | String.t(),
          image_type: :base64 | :url,
          message: String.t() | nil
        }

  @type solve_result :: {:ok, String.t()} | {:error, term()}

  @doc """
  Solve a CAPTCHA.

  ## Parameters
    - captcha_data: Map containing image data and metadata
    - opts: Solver-specific options (e.g., timeout, API keys)

  ## Returns
    - `{:ok, solution}` on success
    - `{:error, reason}` on failure
  """
  @callback solve(captcha_data(), keyword()) :: solve_result()
end
