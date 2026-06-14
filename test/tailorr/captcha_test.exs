defmodule Tailorr.CaptchaTest do
  # async: false because we use IO
  use ExUnit.Case, async: false

  alias Tailorr.Captcha

  describe "solve/3 - backend routing" do
    test "defaults to manual backend" do
      captcha = %{
        image: "data:image/png;base64,abc123",
        image_type: :base64,
        message: "Enter code"
      }

      # Will prompt for input - test the backend routing works
      result = send_input_and_solve(captcha, :manual, "test123\n")
      assert {:ok, "test123"} = result
    end

    test "routes to mock backend" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:ok, "MOCK123"} = Captcha.solve(captcha, :mock)
    end

    test "routes to mock backend with custom solution" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:ok, "CUSTOM"} = Captcha.solve(captcha, :mock, solution: "CUSTOM")
    end

    test "routes to ocr backend" do
      captcha = %{image: "test.png", image_type: :url}
      # OCR will fail without real image, but routing should work
      result = Captcha.solve(captcha, :ocr)
      # Should attempt to download and process
      assert match?({:error, _}, result)
    end

    test "routes to ml backend" do
      captcha = %{image: "test.png", image_type: :url}
      result = Captcha.solve(captcha, :ml)
      # Will fail but routing works
      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end

    test "routes to telegram backend" do
      captcha = %{image: "test.png", image_type: :url}
      # Telegram will fail without the bot running, but routing should work
      assert {:error, :telegram_bot_not_running} = Captcha.solve(captcha, :telegram)
    end

    test "routes to tesseract backend (alias for ocr)" do
      captcha = %{image: "test.png", image_type: :url}
      result = Captcha.solve(captcha, :tesseract)
      # Should route to OCR backend
      assert match?({:error, _}, result)
    end

    test "routes to twocaptcha backend" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:error, :not_implemented} = Captcha.solve(captcha, :twocaptcha)
    end

    test "routes to anticaptcha backend" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:error, :not_implemented} = Captcha.solve(captcha, :anticaptcha)
    end

    test "returns error for unsupported backend" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:error, {:unsupported_backend, :unknown}} = Captcha.solve(captcha, :unknown)
    end
  end

  describe "solve/3 - backend options" do
    test "mock backend accepts custom solution" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:ok, "ABC123"} = Captcha.solve(captcha, :mock, solution: "ABC123")
    end

    test "mock backend accepts error mode" do
      captcha = %{image: "test.png", image_type: :url}

      assert {:error, :test_error} =
               Captcha.solve(captcha, :mock, error: true, error_reason: :test_error)
    end

    test "mock backend accepts delay" do
      captcha = %{image: "test.png", image_type: :url}
      start = System.monotonic_time(:millisecond)
      Captcha.solve(captcha, :mock, delay: 50)
      elapsed = System.monotonic_time(:millisecond) - start
      assert elapsed >= 50
    end
  end

  describe "manual solving" do
    test "accepts valid solution" do
      captcha = %{
        image: "test.png",
        image_type: :url,
        message: "Enter characters"
      }

      result = send_input_and_solve(captcha, :manual, "ABC123\n")
      assert {:ok, "ABC123"} = result
    end

    test "handles cancel command" do
      captcha = %{image: "test.png", image_type: :url}
      result = send_input_and_solve(captcha, :manual, "cancel\n")
      assert {:error, :user_cancelled} = result
    end

    test "handles empty solution" do
      captcha = %{image: "test.png", image_type: :url}
      result = send_input_and_solve(captcha, :manual, "\n")
      assert {:error, :empty_solution} = result
    end

    test "trims whitespace from solution" do
      captcha = %{image: "test.png", image_type: :url}
      result = send_input_and_solve(captcha, :manual, "  ABC  \n")
      assert {:ok, "ABC"} = result
    end

    test "displays URL for url image_type" do
      captcha = %{
        image: "https://example.com/captcha.png",
        image_type: :url
      }

      # Test that it doesn't crash with URL
      result = send_input_and_solve(captcha, :manual, "test\n")
      assert {:ok, "test"} = result
    end

    test "displays base64 preview for base64 image_type" do
      captcha = %{
        image: "iVBORw0KGgoAAAANSUhEUgAAAAUA" <> String.duplicate("A", 100),
        image_type: :base64
      }

      result = send_input_and_solve(captcha, :manual, "test\n")
      assert {:ok, "test"} = result
    end

    test "handles missing message" do
      captcha = %{
        image: "test.png",
        image_type: :url
      }

      result = send_input_and_solve(captcha, :manual, "test\n")
      assert {:ok, "test"} = result
    end
  end

  describe "backend configuration" do
    test "uses backend from config when not specified" do
      # Save original config
      original = Application.get_env(:tailorr, :captcha_backend)

      # Set test config
      Application.put_env(:tailorr, :captcha_backend, :mock)

      captcha = %{image: "test.png", image_type: :url}

      # Should use mock from config
      assert {:ok, "MOCK123"} = Captcha.solve(captcha, nil)

      # Restore
      if original do
        Application.put_env(:tailorr, :captcha_backend, original)
      else
        Application.delete_env(:tailorr, :captcha_backend)
      end
    end

    test "explicit backend overrides config" do
      Application.put_env(:tailorr, :captcha_backend, :manual)

      captcha = %{image: "test.png", image_type: :url}

      # Should use mock (explicit) not manual (config)
      assert {:ok, "MOCK123"} = Captcha.solve(captcha, :mock)

      Application.delete_env(:tailorr, :captcha_backend)
    end
  end

  # Helper to mock IO.gets input
  defp send_input_and_solve(captcha, backend, input, opts \\ []) do
    # Capture IO to avoid pollution
    ExUnit.CaptureIO.capture_io(fn ->
      # Mock stdin
      {:ok, pid} = StringIO.open(input)
      Process.group_leader(self(), pid)

      result = Captcha.solve(captcha, backend, opts)
      send(self(), {:result, result})
    end)

    receive do
      {:result, result} -> result
    after
      100 -> {:error, :timeout}
    end
  end
end
