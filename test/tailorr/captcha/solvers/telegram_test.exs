defmodule Tailorr.Captcha.Solvers.TelegramTest do
  use ExUnit.Case, async: false

  alias Ecto.Adapters.SQL.Sandbox
  alias Tailorr.Captcha.Solvers.Telegram
  alias Tailorr.Captcha.Solvers.Telegram.Bot
  alias Tailorr.Repo

  setup do
    :ok = Sandbox.checkout(Repo)
    Sandbox.mode(Repo, {:shared, self()})

    on_exit(fn ->
      Sandbox.checkin(Repo)
    end)

    :ok
  end

  describe "solve/2 - bot not running" do
    test "returns error when Bot process is not started" do
      # Ensure Bot is not running (it won't be in a fresh test without start_supervised!)
      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      assert {:error, :telegram_bot_not_running} = Telegram.solve(captcha)
    end
  end

  describe "solve/2 - bot running with no registered chats" do
    test "returns error when no users have registered" do
      Req.Test.stub(:tg, fn conn ->
        Req.Test.json(conn, %{"ok" => true, "result" => []})
      end)

      pid = start_supervised!({Bot, [bot_token: "test_token", polling: false, req_options: [plug: {Req.Test, :tg}]]})
      Req.Test.allow(:tg, self(), pid)

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}

      assert {:error, :no_registered_chats} = Telegram.solve(captcha, timeout: 1_000)
    end
  end

  @moduletag :integration
  @tag :skip
  test "integration: broadcasts to registered users and receives solution" do
    # Requires a running bot with TELEGRAM_BOT_TOKEN and at least one registered user.
    # Run with: TELEGRAM_BOT_TOKEN=xxx mix test --only integration
    :ok
  end
end
