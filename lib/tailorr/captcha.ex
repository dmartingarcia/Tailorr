defmodule Tailorr.Captcha do
  @moduledoc """
  CAPTCHA solving interface with pluggable backends.

  Supports:
  - Mock (testing)
  - Manual solving (human in the loop)
  - OCR (Tesseract for simple image CAPTCHAs)
  - Telegram (send to Telegram channel for human solving)
  - External services (2captcha, Anti-Captcha, etc.)

  ## Available Backends

  - `:mock` - Always returns a configured response (testing only)
  - `:manual` - CLI prompt for human input
  - `:ocr` - Tesseract OCR for simple image CAPTCHAs
  - `:ml` - Machine Learning with training capabilities
  - `:telegram` - Send to Telegram channel/chat
  - `:twocaptcha` - 2Captcha.com service
  - `:anticaptcha` - Anti-Captcha.com service

  ## Configuration

      config :tailorr,
        captcha_backend: :telegram,  # Default backend
        telegram_captcha: [
          bot_token: System.get_env("TELEGRAM_BOT_TOKEN"),
          chat_id: System.get_env("TELEGRAM_CHAT_ID")
        ]
  """

  alias Tailorr.Captcha.Solvers

  @type captcha_data :: %{
          image: binary() | String.t(),
          image_type: :base64 | :url,
          message: String.t() | nil
        }

  @type solver_backend ::
          :mock | :manual | :ocr | :ml | :telegram | :tesseract | :twocaptcha | :anticaptcha

  # Backend atom to module mapping
  @backends %{
    mock: Solvers.Mock,
    manual: :manual_legacy,
    ocr: Solvers.OCR,
    ml: Solvers.ML,
    telegram: Solvers.Telegram,
    tesseract: Solvers.OCR,
    twocaptcha: :twocaptcha_legacy,
    anticaptcha: :anticaptcha_legacy
  }

  @doc """
  Solve a CAPTCHA using the configured backend.

  ## Parameters
    - captcha_data: Map with image data and metadata
    - backend: Solver to use (default from config)
    - opts: Backend-specific options

  ## Returns
    - {:ok, solution} when solved successfully
    - {:error, reason} on failure

  ## Examples

      # Mock backend (testing)
      captcha = %{image: "test.png", image_type: :url}
      Captcha.solve(captcha, :mock, solution: "TEST123")
      #=> {:ok, "TEST123"}

      # OCR backend
      captcha = %{image: "https://site.com/captcha.php", image_type: :url}
      Captcha.solve(captcha, :ocr, whitelist: "0123456789")
      #=> {:ok, "492851"}

      # Telegram backend
      Captcha.solve(captcha, :telegram, timeout: 60_000)
      #=> {:ok, "ABC123"}
  """
  def solve(captcha_data, backend \\ nil, opts \\ []) do
    backend = backend || Application.get_env(:tailorr, :captcha_backend, :manual)
    solver_module = Map.get(@backends, backend)

    case solver_module do
      nil ->
        {:error, {:unsupported_backend, backend}}

      :manual_legacy ->
        solve_manual(captcha_data, opts)

      :twocaptcha_legacy ->
        solve_twocaptcha(captcha_data, opts)

      :anticaptcha_legacy ->
        solve_anticaptcha(captcha_data, opts)

      module when is_atom(module) ->
        module.solve(captcha_data, opts)
    end
  end

  # --- Manual Solving (Human in the Loop) ---

  defp solve_manual(captcha_data, _opts) do
    # For now, this returns an error - in a real implementation:
    # - Phoenix LiveView could show the CAPTCHA to the user
    # - CLI could save image and prompt for input
    # - Web UI could display modal with image

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

  # --- 2Captcha Service ---

  defp solve_twocaptcha(_captcha_data, _opts) do
    # TODO: Implement 2Captcha API integration
    # Requires API key from config
    # POST image to 2captcha.com/in.php
    # Poll 2captcha.com/res.php for result
    {:error, :not_implemented}
  end

  # --- Anti-Captcha Service ---

  defp solve_anticaptcha(_captcha_data, _opts) do
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
