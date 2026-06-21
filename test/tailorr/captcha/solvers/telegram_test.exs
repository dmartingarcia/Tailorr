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

  describe "solve/2 - full flow" do
    test "broadcasts to registered user and returns solution" do
      Req.Test.stub(:tg_solve, fn conn ->
        cond do
          String.contains?(conn.request_path, "sendPhoto") ->
            Req.Test.json(conn, %{"ok" => true, "result" => %{"message_id" => 42}})

          true ->
            Req.Test.json(conn, %{"ok" => true, "result" => %{"message_id" => 99}})
        end
      end)

      %Tailorr.Captcha.TelegramChat{}
      |> Tailorr.Captcha.TelegramChat.changeset(%{chat_id: 60_001, first_name: "Tester"})
      |> Repo.insert!()

      pid =
        start_supervised!(
          {Bot,
           [bot_token: "test_token", polling: false, req_options: [plug: {Req.Test, :tg_solve}]]}
        )

      Req.Test.allow(:tg_solve, self(), pid)

      test_pid = self()

      # solve/2 blocks in a receive — run it in a task so the test can drive the reply
      Task.start(fn ->
        captcha = %{image: "https://example.com/captcha.png", image_type: :url}
        result = Telegram.solve(captcha, timeout: 2_000)
        send(test_pid, {:solve_result, result})
      end)

      # Give the task time to call broadcast_captcha and enter the receive block
      Process.sleep(100)

      # Simulate a user replying to the CAPTCHA photo (message_id 42 from stub)
      Bot.simulate_update(%{
        "update_id" => 1,
        "message" => %{
          "message_id" => 99,
          "text" => "ABC123",
          "chat" => %{"id" => 60_001},
          "from" => %{"id" => 60_001},
          "reply_to_message" => %{"message_id" => 42}
        }
      })

      assert_receive {:solve_result, {:ok, "ABC123"}}, 1_000
    end

    test "times out when nobody replies" do
      Req.Test.stub(:tg_timeout, fn conn ->
        Req.Test.json(conn, %{"ok" => true, "result" => %{"message_id" => 42}})
      end)

      %Tailorr.Captcha.TelegramChat{}
      |> Tailorr.Captcha.TelegramChat.changeset(%{chat_id: 70_001})
      |> Repo.insert!()

      pid =
        start_supervised!(
          {Bot,
           [
             bot_token: "test_token",
             polling: false,
             req_options: [plug: {Req.Test, :tg_timeout}]
           ]}
        )

      Req.Test.allow(:tg_timeout, self(), pid)

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      assert {:error, :timeout} = Telegram.solve(captcha, timeout: 200)
    end
  end
end
