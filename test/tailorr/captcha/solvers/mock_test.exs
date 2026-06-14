defmodule Tailorr.Captcha.Solvers.MockTest do
  use ExUnit.Case, async: true

  alias Tailorr.Captcha.Solvers.Mock

  describe "solve/2" do
    test "returns default solution" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:ok, "MOCK123"} = Mock.solve(captcha)
    end

    test "returns custom solution" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:ok, "CUSTOM"} = Mock.solve(captcha, solution: "CUSTOM")
    end

    test "returns error when configured" do
      captcha = %{image: "test.png", image_type: :url}
      assert {:error, :mock_error} = Mock.solve(captcha, error: true)
    end

    test "returns custom error reason" do
      captcha = %{image: "test.png", image_type: :url}

      assert {:error, :custom_failure} =
               Mock.solve(captcha, error: true, error_reason: :custom_failure)
    end

    test "respects delay option" do
      captcha = %{image: "test.png", image_type: :url}
      start = System.monotonic_time(:millisecond)
      Mock.solve(captcha, delay: 50)
      elapsed = System.monotonic_time(:millisecond) - start
      assert elapsed >= 50
    end

    test "works with base64 images" do
      captcha = %{
        image: "iVBORw0KGgoAAAANSUhEUgAAAAUA",
        image_type: :base64,
        message: "Enter code"
      }

      assert {:ok, "MOCK123"} = Mock.solve(captcha)
    end
  end
end
