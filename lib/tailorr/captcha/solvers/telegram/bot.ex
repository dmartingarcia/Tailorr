defmodule Tailorr.Captcha.Solvers.Telegram.Bot do
  @moduledoc """
  GenServer that manages a multi-user Telegram bot for CAPTCHA solving.

  Users register by sending `/start` to the bot. When a CAPTCHA needs solving,
  it is broadcast to all registered chats. The first reply wins; all others
  receive a notification that the CAPTCHA was already solved.

  Chat IDs are persisted to the database so registrations survive restarts.

  ## Polling strategy

  Long polling is done non-blocking: `handle_info(:poll, state)` spawns a
  `Task` for the HTTP call and the GenServer stays responsive while the
  30-second HTTP timeout is in flight.
  """

  use GenServer
  require Logger

  alias Tailorr.Captcha.TelegramChat
  alias Tailorr.Repo

  # ---- Public API ----

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc "Returns the list of currently registered chat IDs."
  @spec registered_chats() :: [integer()]
  def registered_chats do
    GenServer.call(__MODULE__, :registered_chats)
  end

  @doc """
  Broadcasts a CAPTCHA to all registered chats.

  Returns `{:ok, ref}` on success. The calling process will later receive
  `{:captcha_solution, ref, solution}` when someone replies.

  Returns `{:error, :no_registered_chats}` if nobody has registered yet,
  or `{:error, :send_failed}` if all sends fail.
  """
  @spec broadcast_captcha(map(), keyword()) ::
          {:ok, reference()} | {:error, :no_registered_chats} | {:error, :send_failed}
  def broadcast_captcha(captcha_data, opts \\ []) do
    GenServer.call(__MODULE__, {:broadcast_captcha, captcha_data, opts, self()})
  end

  @doc "Cancels a pending CAPTCHA request and cleans up state."
  @spec cancel_captcha(reference()) :: :ok
  def cancel_captcha(ref) do
    GenServer.cast(__MODULE__, {:cancel_captcha, ref})
  end

  @doc "Injects a raw Telegram update map for testing without a live poll loop."
  @spec simulate_update(map()) :: :ok
  def simulate_update(update) do
    GenServer.call(__MODULE__, {:simulate_update, update})
  end

  # ---- GenServer callbacks ----

  @impl true
  def init(opts) do
    bot_token = Keyword.fetch!(opts, :bot_token)
    req_options = Keyword.get(opts, :req_options, [])
    polling = Keyword.get(opts, :polling, true)

    registered_chats =
      Repo.all(TelegramChat)
      |> Enum.map(& &1.chat_id)
      |> MapSet.new()

    state = %{
      bot_token: bot_token,
      req_options: req_options,
      registered_chats: registered_chats,
      pending: %{},
      message_id_to_ref: %{},
      last_update_id: nil
    }

    if polling, do: send(self(), :poll)
    {:ok, state}
  end

  @impl true
  def handle_call(:registered_chats, _from, state) do
    {:reply, MapSet.to_list(state.registered_chats), state}
  end

  def handle_call({:broadcast_captcha, captcha_data, _opts, from_pid}, _from, state) do
    if MapSet.size(state.registered_chats) == 0 do
      {:reply, {:error, :no_registered_chats}, state}
    else
      broadcast_to_registered_chats(captcha_data, from_pid, state)
    end
  end

  def handle_call({:simulate_update, update}, _from, state) do
    {:reply, :ok, process_update(update, state)}
  end

  defp broadcast_to_registered_chats(captcha_data, from_pid, state) do
    caption =
      "CAPTCHA challenge\n\n#{captcha_data[:message] || "Please solve this CAPTCHA."}\n\nYou must reply to this message with the answer (use Telegram's reply feature)."

    {sent_messages, _failed} =
      state.registered_chats
      |> MapSet.to_list()
      |> Enum.map(&send_to_chat(state.bot_token, state.req_options, &1, captcha_data, caption))
      |> Enum.split_with(&match?({:ok, _}, &1))

    if sent_messages == [] do
      {:reply, {:error, :send_failed}, state}
    else
      ref = make_ref()
      new_state = register_pending(state, sent_messages, from_pid, ref)
      {:reply, {:ok, ref}, new_state}
    end
  end

  defp send_to_chat(bot_token, req_options, chat_id, captcha_data, caption) do
    case send_captcha_to_chat(bot_token, req_options, chat_id, captcha_data, caption) do
      {:ok, message_id} -> {:ok, {chat_id, message_id}}
      {:error, reason} -> {:error, {chat_id, reason}}
    end
  end

  defp register_pending(state, sent_messages, from_pid, ref) do
    messages = Enum.map(sent_messages, fn {:ok, pair} -> pair end)
    pending_entry = %{messages: messages, from_pid: from_pid}
    new_pending = Map.put(state.pending, ref, pending_entry)

    new_msg_to_ref =
      Enum.reduce(messages, state.message_id_to_ref, fn {_chat_id, message_id}, acc ->
        Map.put(acc, message_id, ref)
      end)

    %{state | pending: new_pending, message_id_to_ref: new_msg_to_ref}
  end

  @impl true
  def handle_cast({:cancel_captcha, ref}, state) do
    {:noreply, remove_pending(state, ref)}
  end

  @impl true
  def handle_info(:poll, state) do
    server = self()
    token = state.bot_token
    offset = if state.last_update_id, do: state.last_update_id + 1, else: nil
    req_options = state.req_options

    Task.start(fn ->
      result = fetch_updates(token, offset, req_options)
      send(server, {:updates, result})
    end)

    {:noreply, state}
  end

  def handle_info({:updates, {:ok, []}}, state) do
    send(self(), :poll)
    {:noreply, state}
  end

  def handle_info({:updates, {:ok, updates}}, state) do
    new_state = process_updates(updates, state)
    send(self(), :poll)
    {:noreply, new_state}
  end

  def handle_info({:updates, {:error, reason}}, state) do
    Logger.warning("Telegram poll error: #{inspect(reason)}")
    Process.send_after(self(), :poll, 5_000)
    {:noreply, state}
  end

  # ---- Private helpers ----

  defp fetch_updates(token, offset, req_options) do
    params = %{timeout: 30, allowed_updates: ["message"]}
    params = if offset, do: Map.put(params, :offset, offset), else: params
    url = "https://api.telegram.org/bot#{token}/getUpdates"
    opts = Keyword.merge([json: params, receive_timeout: 35_000], req_options)

    case Req.post(url, opts) do
      {:ok, %{status: 200, body: %{"ok" => true, "result" => updates}}} ->
        {:ok, updates}

      {:ok, response} ->
        {:error, {:unexpected_response, response}}

      {:error, reason} ->
        {:error, {:http_error, reason}}
    end
  end

  defp process_updates(updates, state) do
    last_update_id =
      updates
      |> List.last()
      |> Map.get("update_id")

    new_state =
      Enum.reduce(updates, state, fn update, acc ->
        process_update(update, acc)
      end)

    %{new_state | last_update_id: last_update_id}
  end

  defp process_update(%{"message" => message}, state) do
    cond do
      start_command?(message) ->
        handle_start(message, state)

      captcha_reply?(message, state) ->
        handle_captcha_reply(message, state)

      true ->
        state
    end
  end

  defp process_update(_update, state), do: state

  defp start_command?(%{"text" => text}) when is_binary(text) do
    text == "/start" or String.starts_with?(text, "/start ")
  end

  defp start_command?(_), do: false

  defp captcha_reply?(%{"reply_to_message" => %{"message_id" => message_id}}, state) do
    Map.has_key?(state.message_id_to_ref, message_id)
  end

  defp captcha_reply?(_, _), do: false

  defp handle_start(%{"chat" => %{"id" => chat_id}, "from" => from} = _message, state) do
    first_name = Map.get(from, "first_name", "there")

    changeset =
      TelegramChat.changeset(%TelegramChat{}, %{
        chat_id: chat_id,
        first_name: first_name,
        username: Map.get(from, "username")
      })

    case Repo.insert(changeset) do
      {:ok, _} ->
        new_chats = MapSet.put(state.registered_chats, chat_id)

        send_message(
          state.bot_token,
          state.req_options,
          chat_id,
          "Hi #{first_name}! ✅ You are now registered and will receive CAPTCHA requests."
        )

        %{state | registered_chats: new_chats}

      {:error, _changeset} ->
        send_message(state.bot_token, state.req_options, chat_id, "Already registered ✅")
        state
    end
  end

  defp handle_captcha_reply(
         %{
           "reply_to_message" => %{"message_id" => replied_to_id},
           "chat" => %{"id" => solver_chat_id},
           "text" => solution
         },
         state
       )
       when is_binary(solution) and solution != "" do
    ref = Map.get(state.message_id_to_ref, replied_to_id)

    case Map.get(state.pending, ref) do
      nil ->
        state

      %{from_pid: from_pid, messages: messages} ->
        send(from_pid, {:captcha_solution, ref, String.trim(solution)})

        send_message(state.bot_token, state.req_options, solver_chat_id, "✅ Solution received!")

        messages
        |> Enum.reject(fn {chat_id, _} -> chat_id == solver_chat_id end)
        |> Enum.each(fn {chat_id, _} ->
          send_message(
            state.bot_token,
            state.req_options,
            chat_id,
            "ℹ️ CAPTCHA already solved by another user."
          )
        end)

        remove_pending(state, ref)
    end
  end

  defp handle_captcha_reply(_message, state), do: state

  defp remove_pending(state, ref) do
    case Map.get(state.pending, ref) do
      nil ->
        state

      %{messages: messages} ->
        new_pending = Map.delete(state.pending, ref)

        new_msg_to_ref =
          Enum.reduce(messages, state.message_id_to_ref, fn {_chat_id, message_id}, acc ->
            Map.delete(acc, message_id)
          end)

        %{state | pending: new_pending, message_id_to_ref: new_msg_to_ref}
    end
  end

  defp send_captcha_to_chat(token, req_options, chat_id, captcha_data, caption) do
    case captcha_data.image_type do
      :url ->
        body = %{
          chat_id: chat_id,
          photo: captcha_data.image,
          caption: caption,
          parse_mode: "Markdown"
        }

        telegram_request(token, req_options, "sendPhoto", body)

      :base64 ->
        image_data =
          captcha_data.image
          |> String.replace(~r/^data:image\/[^;]+;base64,/, "")
          |> Base.decode64!()

        url = "https://api.telegram.org/bot#{token}/sendPhoto"

        multipart = [
          {"chat_id", to_string(chat_id)},
          {"caption", caption},
          {"parse_mode", "Markdown"},
          {:file, "photo", image_data, filename: "captcha.png"}
        ]

        opts = Keyword.merge([multipart: multipart], req_options)

        case Req.post(url, opts) do
          {:ok, %{status: 200, body: %{"ok" => true, "result" => %{"message_id" => message_id}}}} ->
            {:ok, message_id}

          {:ok, %{body: %{"ok" => false, "description" => desc}}} ->
            {:error, {:telegram_api_error, desc}}

          {:ok, response} ->
            {:error, {:unexpected_response, response}}

          {:error, reason} ->
            {:error, {:http_error, reason}}
        end
    end
  end

  defp send_message(token, req_options, chat_id, text) do
    body = %{chat_id: chat_id, text: text}

    case telegram_request(token, req_options, "sendMessage", body) do
      {:ok, _} -> :ok
      {:error, reason} -> Logger.warning("Failed to send Telegram message: #{inspect(reason)}")
    end
  end

  defp telegram_request(token, req_options, method, body) do
    url = "https://api.telegram.org/bot#{token}/#{method}"
    opts = Keyword.merge([json: body], req_options)

    case Req.post(url, opts) do
      {:ok, %{status: 200, body: %{"ok" => true, "result" => %{"message_id" => message_id}}}} ->
        {:ok, message_id}

      {:ok, %{body: %{"ok" => false, "description" => desc}}} ->
        {:error, {:telegram_api_error, desc}}

      {:ok, response} ->
        {:error, {:unexpected_response, response}}

      {:error, reason} ->
        {:error, {:http_error, reason}}
    end
  end
end
