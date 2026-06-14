defmodule Tailorr.Captcha.Solvers.Telegram do
  @moduledoc """
  CAPTCHA solver via Telegram channel/chat.

  Sends the CAPTCHA image to a configured Telegram chat and waits for
  a human to reply with the solution.

  ## Configuration

  Required environment variables or config:
    - `TELEGRAM_BOT_TOKEN` - Your Telegram bot API token
    - `TELEGRAM_CHAT_ID` - Chat ID where CAPTCHAs will be sent

  ## Options
    - `:timeout` - How long to wait for reply in ms (default: 120_000 / 2 min)
    - `:bot_token` - Override bot token from config
    - `:chat_id` - Override chat ID from config
    - `:poll_interval` - How often to check for replies in ms (default: 2000)

  ## Setup

  1. Create a Telegram bot via @BotFather
  2. Get the bot token
  3. Add the bot to a channel or get your chat ID
  4. Set environment variables or config:

      config :tailorr, :telegram_captcha,
        bot_token: System.get_env("TELEGRAM_BOT_TOKEN"),
        chat_id: System.get_env("TELEGRAM_CHAT_ID")

  ## Example

      captcha = %{
        image: "https://example.com/captcha.png",
        image_type: :url,
        message: "Enter the code from this image"
      }

      # Will send to Telegram and wait for reply
      Telegram.solve(captcha, timeout: 60_000)
      #=> {:ok, "ABC123"}
  """

  @behaviour Tailorr.Captcha.Solver

  require Logger

  @default_timeout 120_000
  @default_poll_interval 2_000

  @impl true
  def solve(captcha_data, opts \\ []) do
    with {:ok, config} <- get_config(opts),
         {:ok, message_id} <- send_captcha(captcha_data, config),
         {:ok, solution} <- wait_for_reply(message_id, config) do
      {:ok, solution}
    else
      {:error, reason} = error ->
        Logger.error("Telegram CAPTCHA solver failed: #{inspect(reason)}")
        error
    end
  end

  # Get configuration from opts or application env
  defp get_config(opts) do
    app_config = Application.get_env(:tailorr, :telegram_captcha, [])

    bot_token = Keyword.get(opts, :bot_token) || Keyword.get(app_config, :bot_token)
    chat_id = Keyword.get(opts, :chat_id) || Keyword.get(app_config, :chat_id)
    timeout = Keyword.get(opts, :timeout, @default_timeout)
    poll_interval = Keyword.get(opts, :poll_interval, @default_poll_interval)

    cond do
      is_nil(bot_token) ->
        {:error, :missing_bot_token}

      is_nil(chat_id) ->
        {:error, :missing_chat_id}

      true ->
        {:ok,
         %{
           bot_token: bot_token,
           chat_id: chat_id,
           timeout: timeout,
           poll_interval: poll_interval
         }}
    end
  end

  # Send CAPTCHA to Telegram chat
  defp send_captcha(captcha_data, config) do
    caption = captcha_data[:message] || "🔐 CAPTCHA - Reply to this message with the solution"

    case captcha_data.image_type do
      :url ->
        send_photo_url(captcha_data.image, caption, config)

      :base64 ->
        send_photo_base64(captcha_data.image, caption, config)
    end
  end

  defp send_photo_url(url, caption, config) do
    body = %{
      chat_id: config.chat_id,
      photo: url,
      caption: caption
    }

    case telegram_request("sendPhoto", body, config) do
      {:ok, %{"result" => %{"message_id" => message_id}}} ->
        {:ok, message_id}

      {:ok, response} ->
        {:error, {:unexpected_response, response}}

      {:error, _} = error ->
        error
    end
  end

  defp send_photo_base64(base64_data, caption, config) do
    # Remove data URI prefix if present
    image_data =
      base64_data
      |> String.replace(~r/^data:image\/[^;]+;base64,/, "")
      |> Base.decode64!()

    # Req supports multipart natively
    url = telegram_url("sendPhoto", config)

    multipart = [
      {"chat_id", config.chat_id},
      {"caption", caption},
      {:file, "photo", image_data, filename: "captcha.png"}
    ]

    case Req.post(url, multipart: multipart) do
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

  # Wait for user to reply to the message
  defp wait_for_reply(message_id, config) do
    start_time = System.monotonic_time(:millisecond)
    wait_for_reply_loop(message_id, config, start_time, nil)
  end

  defp wait_for_reply_loop(message_id, config, start_time, last_update_id) do
    elapsed = System.monotonic_time(:millisecond) - start_time

    if elapsed >= config.timeout do
      {:error, :timeout}
    else
      case check_for_reply(message_id, config, last_update_id) do
        {:ok, solution} ->
          {:ok, solution}

        {:no_reply, new_update_id} ->
          Process.sleep(config.poll_interval)
          wait_for_reply_loop(message_id, config, start_time, new_update_id)

        {:error, _} = error ->
          error
      end
    end
  end

  # Check Telegram updates for a reply to our message
  defp check_for_reply(message_id, config, last_update_id) do
    params = %{
      offset: if(last_update_id, do: last_update_id + 1, else: -1),
      timeout: div(config.poll_interval, 1000),
      allowed_updates: ["message"]
    }

    case telegram_request("getUpdates", params, config) do
      {:ok, %{"result" => updates}} when is_list(updates) ->
        process_updates(updates, message_id, config.chat_id)

      {:ok, response} ->
        {:error, {:unexpected_response, response}}

      {:error, _} = error ->
        error
    end
  end

  defp process_updates([], _message_id, _chat_id) do
    {:no_reply, nil}
  end

  defp process_updates(updates, message_id, chat_id) do
    last_update_id = updates |> List.last() |> Map.get("update_id")

    # Look for a message that replies to our CAPTCHA message
    reply =
      Enum.find_value(updates, fn update ->
        with %{"message" => msg} <- update,
             %{"chat" => %{"id" => ^chat_id}} <- msg,
             %{"reply_to_message" => %{"message_id" => ^message_id}} <- msg,
             %{"text" => text} when is_binary(text) and text != "" <- msg do
          String.trim(text)
        else
          _ -> nil
        end
      end)

    case reply do
      nil -> {:no_reply, last_update_id}
      solution -> {:ok, solution}
    end
  end

  # Make request to Telegram Bot API
  defp telegram_request(method, params, config) do
    url = telegram_url(method, config)

    case Req.post(url, json: params) do
      {:ok, %{status: 200, body: %{"ok" => true} = body}} ->
        {:ok, body}

      {:ok, %{body: %{"ok" => false, "description" => desc}}} ->
        {:error, {:telegram_api_error, desc}}

      {:ok, response} ->
        {:error, {:unexpected_response, response}}

      {:error, reason} ->
        {:error, {:http_error, reason}}
    end
  end

  defp telegram_url(method, config) do
    "https://api.telegram.org/bot#{config.bot_token}/#{method}"
  end
end
