defmodule Tailorr.Captcha.Solvers.Telegram.BotTest do
  use ExUnit.Case, async: false

  alias Ecto.Adapters.SQL.Sandbox
  alias Tailorr.Captcha.Solvers.Telegram.Bot
  alias Tailorr.Captcha.TelegramChat
  alias Tailorr.Repo

  setup do
    :ok = Sandbox.checkout(Repo)
    Sandbox.mode(Repo, {:shared, self()})

    on_exit(fn ->
      Sandbox.checkin(Repo)
    end)

    :ok
  end

  defp insert_chat(attrs) do
    %TelegramChat{}
    |> TelegramChat.changeset(attrs)
    |> Repo.insert!()
  end

  describe "start_link/1" do
    test "starts successfully with a bot token" do
      pid = start_supervised!({Bot, [bot_token: "test_token_123"]})
      assert Process.alive?(pid)
    end
  end

  describe "registered_chats/0" do
    test "returns empty list when no chats have registered" do
      start_supervised!({Bot, [bot_token: "test_token"]})
      assert Bot.registered_chats() == []
    end

    test "returns chats loaded from the database" do
      insert_chat(%{chat_id: 111_222_333, first_name: "Alice"})
      insert_chat(%{chat_id: 444_555_666, first_name: "Bob"})

      start_supervised!({Bot, [bot_token: "test_token"]})

      chats = Bot.registered_chats()
      assert length(chats) == 2
      assert 111_222_333 in chats
      assert 444_555_666 in chats
    end
  end

  describe "broadcast_captcha/1" do
    test "returns error when no chats are registered" do
      start_supervised!({Bot, [bot_token: "test_token"]})

      captcha = %{image: "https://example.com/captcha.png", image_type: :url}
      assert {:error, :no_registered_chats} = Bot.broadcast_captcha(captcha)
    end
  end

  describe "cancel_captcha/1" do
    test "accepts any ref without crashing" do
      start_supervised!({Bot, [bot_token: "test_token"]})
      ref = make_ref()
      assert :ok = Bot.cancel_captcha(ref)
    end
  end

  describe "DB persistence" do
    test "loads multiple chat IDs from the database on init" do
      insert_chat(%{chat_id: 100})
      insert_chat(%{chat_id: 200})
      insert_chat(%{chat_id: 300})

      start_supervised!({Bot, [bot_token: "test_token"]})

      chats = Bot.registered_chats()
      assert length(chats) == 3
      assert Enum.sort(chats) == [100, 200, 300]
    end

    test "loads only valid chat_id records" do
      insert_chat(%{chat_id: 12_345})
      insert_chat(%{chat_id: 67_890})

      start_supervised!({Bot, [bot_token: "test_token"]})

      chats = Bot.registered_chats()
      assert length(chats) == 2
      assert 12_345 in chats
      assert 67_890 in chats
    end

    test "starts with empty set when no records exist" do
      start_supervised!({Bot, [bot_token: "test_token"]})
      assert Bot.registered_chats() == []
    end
  end

  describe "internal state via :sys.get_state/1" do
    test "initial state has correct structure" do
      start_supervised!({Bot, [bot_token: "my_bot_token"]})

      state = :sys.get_state(Bot)

      assert state.bot_token == "my_bot_token"
      assert %MapSet{} = state.registered_chats
      assert state.pending == %{}
      assert state.message_id_to_ref == %{}
    end
  end
end
