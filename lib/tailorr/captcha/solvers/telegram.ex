defmodule Tailorr.Captcha.Solvers.Telegram do
  @moduledoc """
  CAPTCHA solver via Telegram bot.

  Broadcasts the CAPTCHA image to all users who have registered with the bot
  by sending `/start`. The first person to reply wins; the others receive a
  notification that it was already solved.

  No `TELEGRAM_CHAT_ID` is required — users self-register via the bot.

  ## Configuration

      config :tailorr, :telegram_captcha,
        bot_token: System.get_env("TELEGRAM_BOT_TOKEN")

  ## Options
    - `:timeout` - Milliseconds to wait for a reply (default: 120_000)
  """

  @behaviour Tailorr.Captcha.Solver

  require Logger
  alias Tailorr.Captcha.Solvers.Telegram.Bot

  @default_timeout 120_000

  @impl true
  def solve(captcha_data, opts \\ []) do
    timeout = Keyword.get(opts, :timeout, @default_timeout)

    case Process.whereis(Bot) do
      nil ->
        {:error, :telegram_bot_not_running}

      _pid ->
        with {:ok, ref} <- Bot.broadcast_captcha(captcha_data, opts),
             {:ok, solution} <- wait_for_solution(ref, timeout) do
          {:ok, solution}
        else
          {:error, reason} = error ->
            Logger.error("Telegram CAPTCHA solver failed: #{inspect(reason)}")
            error
        end
    end
  end

  defp wait_for_solution(ref, timeout) do
    receive do
      {:captcha_solution, ^ref, solution} -> {:ok, solution}
    after
      timeout ->
        Bot.cancel_captcha(ref)
        {:error, :timeout}
    end
  end
end
