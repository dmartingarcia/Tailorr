defmodule Tailorr.Captcha.Solvers.Telegram.BotTest do
  use ExUnit.Case, async: false

  alias Ecto.Adapters.SQL.Sandbox
  alias Tailorr.Captcha.Solvers.Telegram.Bot
  alias Tailorr.Captcha.TelegramChat
  alias Tailorr.Repo

  # Stub name used with Req.Test throughout this module
  @stub :telegram_api

  setup do
    :ok = Sandbox.checkout(Repo)
    Sandbox.mode(Repo, {:shared, self()})

    Req.Test.stub(@stub, fn conn ->
      path = conn.request_path

      cond do
        String.contains?(path, "sendPhoto") ->
          Req.Test.json(conn, %{"ok" => true, "result" => %{"message_id" => 42}})

        String.contains?(path, "sendMessage") ->
          Req.Test.json(conn, %{"ok" => true, "result" => %{"message_id" => 99}})

        String.contains?(path, "getUpdates") ->
          Req.Test.json(conn, %{"ok" => true, "result" => []})

        true ->
          Req.Test.json(conn, %{"ok" => true, "result" => %{}})
      end
    end)

    on_exit(fn -> Sandbox.checkin(Repo) end)

    :ok
  end

  defp start_bot(extra_opts \\ []) do
    opts = [bot_token: "test_token", polling: false, req_options: [plug: {Req.Test, @stub}]] ++ extra_opts
    pid = start_supervised!({Bot, opts})
    Req.Test.allow(@stub, self(), pid)
    pid
  end

  defp insert_chat(attrs) do
    %TelegramChat{}
    |> TelegramChat.changeset(attrs)
    |> Repo.insert!()
  end

  defp start_update(chat_id, first_name, username \\ nil) do
    %{
      "update_id" => System.unique_integer([:positive]),
      "message" => %{
        "message_id" => System.unique_integer([:positive]),
        "text" => "/start",
        "chat" => %{"id" => chat_id},
        "from" => %{"id" => chat_id, "first_name" => first_name, "username" => username}
      }
    }
  end

  defp reply_update(chat_id, reply_to_message_id, text) do
    %{
      "update_id" => System.unique_integer([:positive]),
      "message" => %{
        "message_id" => System.unique_integer([:positive]),
        "text" => text,
        "chat" => %{"id" => chat_id},
        "from" => %{"id" => chat_id},
        "reply_to_message" => %{"message_id" => reply_to_message_id}
      }
    }
  end

  # ---- Basic lifecycle ----

  describe "start_link/1" do
    test "starts successfully with a bot token" do
      pid = start_bot()
      assert Process.alive?(pid)
    end

    test "polling: false means no :poll message is sent on start" do
      start_bot()
      state = :sys.get_state(Bot)
      # If polling were enabled a Task would have been spawned immediately;
      # with polling: false the GenServer mailbox stays clear.
      assert state.last_update_id == nil
    end
  end

  describe "registered_chats/0" do
    test "returns empty list when database has no rows" do
      start_bot()
      assert Bot.registered_chats() == []
    end

    test "returns chat IDs seeded in the database before start" do
      insert_chat(%{chat_id: 111_222, first_name: "Alice"})
      insert_chat(%{chat_id: 333_444, first_name: "Bob"})

      start_bot()

      chats = Bot.registered_chats()
      assert length(chats) == 2
      assert 111_222 in chats
      assert 333_444 in chats
    end
  end

  # ---- /start registration ----

  describe "/start command" do
    test "registers a new user and persists to DB" do
      start_bot()
      assert Bot.registered_chats() == []

      :ok = Bot.simulate_update(start_update(12_345, "Alice", "alice_tg"))

      assert 12_345 in Bot.registered_chats()
      assert Repo.get_by(TelegramChat, chat_id: 12_345) != nil
    end

    test "stores first_name and username" do
      start_bot()
      :ok = Bot.simulate_update(start_update(99_999, "Bob", "bobthecat"))

      chat = Repo.get_by(TelegramChat, chat_id: 99_999)
      assert chat.first_name == "Bob"
      assert chat.username == "bobthecat"
    end

    test "duplicate /start does not create a second DB record" do
      start_bot()
      :ok = Bot.simulate_update(start_update(77_777, "Carol"))
      :ok = Bot.simulate_update(start_update(77_777, "Carol"))

      assert Repo.aggregate(TelegramChat, :count, :id) == 1
    end

    test "in-memory set is updated after /start" do
      start_bot()
      refute 55_555 in Bot.registered_chats()

      :ok = Bot.simulate_update(start_update(55_555, "Dave"))

      assert 55_555 in Bot.registered_chats()
    end
  end

  # ---- CAPTCHA broadcast ----

  describe "broadcast_captcha/1" do
    test "returns :no_registered_chats when nobody has registered" do
      start_bot()
      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      assert {:error, :no_registered_chats} = Bot.broadcast_captcha(captcha)
    end

    test "returns {:ok, ref} when at least one chat is registered" do
      insert_chat(%{chat_id: 10_001})
      start_bot()

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      assert {:ok, ref} = Bot.broadcast_captcha(captcha)
      assert is_reference(ref)
    end

    test "ref is added to pending state" do
      insert_chat(%{chat_id: 10_002})
      start_bot()

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      {:ok, ref} = Bot.broadcast_captcha(captcha)

      state = :sys.get_state(Bot)
      assert Map.has_key?(state.pending, ref)
      assert Map.has_key?(state.message_id_to_ref, 42)
    end
  end

  # ---- CAPTCHA reply / first-reply-wins ----

  describe "CAPTCHA reply flow" do
    test "solver process receives {:captcha_solution, ref, solution} on reply" do
      insert_chat(%{chat_id: 20_001})
      start_bot()

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      {:ok, ref} = Bot.broadcast_captcha(captcha)

      # Telegram returns message_id 42 from the stub; reply to it
      :ok = Bot.simulate_update(reply_update(20_001, 42, "XY9Z"))

      assert_receive {:captcha_solution, ^ref, "XY9Z"}, 500
    end

    test "pending entry is removed after reply" do
      insert_chat(%{chat_id: 20_002})
      start_bot()

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      {:ok, ref} = Bot.broadcast_captcha(captcha)

      :ok = Bot.simulate_update(reply_update(20_002, 42, "ABC"))

      state = :sys.get_state(Bot)
      refute Map.has_key?(state.pending, ref)
      refute Map.has_key?(state.message_id_to_ref, 42)
    end

    test "first reply wins when multiple users are registered" do
      insert_chat(%{chat_id: 30_001})
      insert_chat(%{chat_id: 30_002})
      start_bot()

      # The stub always returns message_id 42, but since each chat gets a
      # separate sendPhoto call the state maps both chat_ids to the same ref.
      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      {:ok, ref} = Bot.broadcast_captcha(captcha)

      # First user replies
      :ok = Bot.simulate_update(reply_update(30_001, 42, "FIRST"))
      assert_receive {:captcha_solution, ^ref, "FIRST"}, 500

      # Second reply arrives after — should be ignored (pending already gone)
      :ok = Bot.simulate_update(reply_update(30_002, 42, "SECOND"))
      refute_receive {:captcha_solution, _, "SECOND"}, 200
    end

    test "reply to an unknown message_id is ignored" do
      insert_chat(%{chat_id: 40_001})
      start_bot()

      :ok = Bot.simulate_update(reply_update(40_001, 9_999_999, "ghost reply"))
      refute_receive {:captcha_solution, _, _}, 200
    end
  end

  # ---- cancel_captcha/1 ----

  describe "cancel_captcha/1" do
    test "removes a pending entry" do
      insert_chat(%{chat_id: 50_001})
      start_bot()

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      {:ok, ref} = Bot.broadcast_captcha(captcha)

      assert Map.has_key?(:sys.get_state(Bot).pending, ref)

      :ok = Bot.cancel_captcha(ref)
      # cast is async; give the GenServer a moment
      Process.sleep(50)

      refute Map.has_key?(:sys.get_state(Bot).pending, ref)
    end

    test "ignores unknown refs without crashing" do
      start_bot()
      assert :ok = Bot.cancel_captcha(make_ref())
    end
  end
end
