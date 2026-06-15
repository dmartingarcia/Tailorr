defmodule TailorrWeb.Settings.TelegramLive do
  use TailorrWeb, :live_view

  alias Tailorr.Captcha.TelegramChat
  alias Tailorr.Repo

  @impl true
  def mount(_params, _session, socket) do
    chats = Repo.all(TelegramChat)

    token_configured? =
      not is_nil(Application.get_env(:tailorr, :telegram_captcha, [])[:bot_token])

    {:ok, assign(socket, chats: chats, token_configured?: token_configured?)}
  end

  @impl true
  def handle_event("remove", %{"id" => id}, socket) do
    id = String.to_integer(id)

    case Repo.get(TelegramChat, id) do
      nil ->
        {:noreply, socket}

      chat ->
        Repo.delete(chat)
        {:noreply, assign(socket, chats: Repo.all(TelegramChat))}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold mb-2">Telegram CAPTCHA Bot</h1>
      <p class="text-sm text-gray-500 mb-6">Users register by sending /start to your bot.</p>

      <div class={[
        "mb-6 px-4 py-3 rounded-lg text-sm font-medium",
        if(@token_configured?,
          do: "bg-green-50 text-green-800 border border-green-200",
          else: "bg-yellow-50 text-yellow-800 border border-yellow-200"
        )
      ]}>
        Bot token: <%= if @token_configured?, do: "configured", else: "not configured" %>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Chat ID</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">First Name</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Username</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Registered At</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <%= if @chats == [] do %>
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">
                  No registered users yet.
                </td>
              </tr>
            <% end %>
            <%= for chat <- @chats do %>
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-mono text-gray-800"><%= chat.chat_id %></td>
                <td class="px-4 py-3 text-gray-700"><%= chat.first_name || "—" %></td>
                <td class="px-4 py-3 text-gray-700">
                  <%= if chat.username, do: "@#{chat.username}", else: "—" %>
                </td>
                <td class="px-4 py-3 text-gray-500">
                  <%= Calendar.strftime(chat.inserted_at, "%Y-%m-%d %H:%M") %>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    phx-click="remove"
                    phx-value-id={chat.id}
                    data-confirm="Remove this user?"
                    class="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
