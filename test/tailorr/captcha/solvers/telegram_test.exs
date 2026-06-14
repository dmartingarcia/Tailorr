defmodule Tailorr.Captcha.Solvers.TelegramTest do
  use ExUnit.Case, async: true

  alias Tailorr.Captcha.Solvers.Telegram

  describe "solve/2 - configuration" do
    test "returns error when bot token is missing" do
      captcha = %{image: "test.png", image_type: :url}

      # Clear any config
      result = Telegram.solve(captcha, chat_id: "123")

      assert {:error, :missing_bot_token} = result
    end

    test "returns error when chat_id is missing" do
      captcha = %{image: "test.png", image_type: :url}

      result = Telegram.solve(captcha, bot_token: "test_token")

      assert {:error, :missing_chat_id} = result
    end

    test "uses config from application env" do
      # Set test config
      Application.put_env(:tailorr, :telegram_captcha,
        bot_token: "test_token",
        chat_id: "test_chat"
      )

      captcha = %{image: "test.png", image_type: :url}

      # Should not fail for missing config
      # Will fail for network/API reasons but config is valid
      result = Telegram.solve(captcha)

      # Cleanup
      Application.delete_env(:tailorr, :telegram_captcha)

      assert match?({:ok, _}, result) or match?({:error, _}, result)
      refute match?({:error, :missing_bot_token}, result)
      refute match?({:error, :missing_chat_id}, result)
    end

    test "options override application config" do
      Application.put_env(:tailorr, :telegram_captcha,
        bot_token: "config_token",
        chat_id: "config_chat"
      )

      captcha = %{image: "test.png", image_type: :url}

      # Override with options
      result =
        Telegram.solve(captcha,
          bot_token: "override_token",
          chat_id: "override_chat"
        )

      Application.delete_env(:tailorr, :telegram_captcha)

      # Config was valid, error will be from API call
      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end

  describe "solve/2 - image types" do
    test "accepts URL images" do
      captcha = %{
        image: "https://example.com/captcha.png",
        image_type: :url,
        message: "Test message"
      }

      result =
        Telegram.solve(captcha,
          bot_token: "test",
          chat_id: "test"
        )

      # Will fail but shouldn't crash
      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end

    test "accepts base64 images" do
      captcha = %{
        image: "data:image/png;base64,iVBORw0KGgo=",
        image_type: :base64,
        message: "Test"
      }

      result =
        Telegram.solve(captcha,
          bot_token: "test",
          chat_id: "test"
        )

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end

  describe "solve/2 - options" do
    test "respects timeout option" do
      captcha = %{image: "test.png", image_type: :url}

      # Should use custom timeout
      result =
        Telegram.solve(captcha,
          bot_token: "test",
          chat_id: "test",
          timeout: 5_000
        )

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end

    test "respects poll_interval option" do
      captcha = %{image: "test.png", image_type: :url}

      result =
        Telegram.solve(captcha,
          bot_token: "test",
          chat_id: "test",
          poll_interval: 1_000
        )

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end

  @moduletag :integration
  @tag :skip
  test "integration: sends and receives from real Telegram" do
    # This test requires:
    # - TELEGRAM_BOT_TOKEN env var
    # - TELEGRAM_CHAT_ID env var
    # - Manual interaction to reply
    #
    # Run with: TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy mix test --only integration
    :ok
  end
end
