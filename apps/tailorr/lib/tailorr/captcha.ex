defmodule Tailorr.Captcha do
  @moduledoc """
  CAPTCHA solving interface with pluggable backends.

  Supports:
  - Manual solving (human in the loop)
  - OCR services (Tesseract, cloud APIs)
  - CAPTCHA solving services (2captcha, Anti-Captcha, etc.)
  """

  @type captcha_data :: %{
          image: binary() | String.t(),
          image_type: :base64 | :url,
          message: String.t() | nil
        }

  @type solver_backend :: :manual | :tesseract | :twocaptcha | :anticaptcha

  @doc """
  Solve a CAPTCHA using the configured backend.

  ## Parameters
    - captcha_data: Map with image data and metadata
    - backend: Solver to use (default from config)
    - opts: Backend-specific options

  ## Returns
    - {:ok, solution} when solved successfully
    - {:error, reason} on failure
    - {:error, :user_cancelled} if user cancels manual solving

  ## Examples

      captcha = %{
        image: "data:image/png;base64,...",
        image_type: :base64,
        message: "Por favor ingresa los caracteres que ves"
      }

      Captcha.solve(captcha, :manual)
      #=> {:ok, "ABC123"}

  """
  def solve(captcha_data, backend \\ nil, opts \\ []) do
    backend = backend || Application.get_env(:tailorr, :captcha_backend, :manual)

    case backend do
      :manual -> solve_manual(captcha_data, opts)
      :tesseract -> solve_tesseract(captcha_data, opts)
      :twocaptcha -> solve_twocaptcha(captcha_data, opts)
      :anticaptcha -> solve_anticaptcha(captcha_data, opts)
      other -> {:error, {:unsupported_backend, other}}
    end
  end

  # --- Manual Solving (Human in the Loop) ---

  defp solve_manual(captcha_data, opts) do
    # For now, this returns an error - in a real implementation:
    # - Phoenix LiveView could show the CAPTCHA to the user
    # - CLI could save image and prompt for input
    # - Web UI could display modal with image

    timeout = Keyword.get(opts, :timeout, 60_000)

    IO.puts("\n========================================")
    IO.puts("CAPTCHA REQUIRED")
    IO.puts("========================================")
    IO.puts("Message: #{captcha_data[:message] || "Enter characters from image"}")
    IO.puts("Image: #{preview_image(captcha_data)}")
    IO.puts("========================================")
    IO.write("Solution (or 'cancel'): ")

    case IO.gets("") do
      "cancel\n" -> {:error, :user_cancelled}
      "\n" -> {:error, :empty_solution}
      solution -> {:ok, String.trim(solution)}
    end
  end

  # --- Tesseract OCR ---

  defp solve_tesseract(captcha_data, opts) do
    # TODO: Implement Tesseract integration
    # - Save image to temp file
    # - Run: tesseract image.png stdout
    # - Parse output
    {:error, :not_implemented}
  end

  # --- 2Captcha Service ---

  defp solve_twocaptcha(captcha_data, opts) do
    # TODO: Implement 2Captcha API integration
    # Requires API key from config
    # POST image to 2captcha.com/in.php
    # Poll 2captcha.com/res.php for result
    {:error, :not_implemented}
  end

  # --- Anti-Captcha Service ---

  defp solve_anticaptcha(captcha_data, opts) do
    # TODO: Implement Anti-Captcha API integration
    {:error, :not_implemented}
  end

  # --- Helpers ---

  defp preview_image(%{image_type: :url, image: url}) do
    url
  end

  defp preview_image(%{image_type: :base64, image: data}) do
    # Show first 50 chars of base64
    preview = data |> String.slice(0, 50)
    "#{preview}... (base64, #{byte_size(data)} bytes)"
  end

  defp preview_image(_), do: "(unknown format)"
end
