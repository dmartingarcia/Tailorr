defmodule TailorrWeb.TrackerTest.Components do
  @moduledoc """
  Reusable components for Tracker Test UI.

  SRP: Only presentation logic, no business logic.
  """
  use Phoenix.Component

  import TailorrWeb.CoreComponents

  @doc """
  Renders a table of search results.

  ## Examples

      <.results_table results={@results} />
  """
  attr(:results, :list, required: true)

  def results_table(assigns) do
    ~H"""
    <div class="overflow-hidden rounded-lg border border-zinc-200 shadow">
      <table class="min-w-full divide-y divide-zinc-200">
        <thead class="bg-zinc-50">
          <tr>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              Title
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              Size
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              Seeds
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              Tracker
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              Download
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 bg-white">
          <tr :for={result <- @results} class="hover:bg-zinc-50">
            <td class="px-3 py-4 text-sm text-zinc-900">
              <%= if result.detail_url do %>
                <a href={result.detail_url} target="_blank" class="font-medium text-blue-600 hover:text-blue-800">
                  <%= result.title %>
                </a>
              <% else %>
                <%= result.title %>
              <% end %>
            </td>
            <td class="px-3 py-4 text-sm text-zinc-600">
              <%= format_size(result.size_bytes) %>
            </td>
            <td class="px-3 py-4 text-sm text-zinc-600">
              <span class="inline-flex items-center">
                <%= result.seeders || 0 %>
                <span class="ml-1 text-zinc-400">/</span>
                <span class="ml-1 text-rose-600"><%= result.leechers || 0 %></span>
              </span>
            </td>
            <td class="px-3 py-4 text-sm text-zinc-600">
              <span class="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                <%= result.tracker_id %>
              </span>
            </td>
            <td class="px-3 py-4 text-sm">
              <%= if result.magnet_url do %>
                <a
                  href={result.magnet_url}
                  class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  <.icon name="hero-arrow-down-tray" class="mr-1 h-4 w-4" />
                  Magnet
                </a>
              <% else %>
                <a
                  href={result.download_url}
                  class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  <.icon name="hero-arrow-down-tray" class="mr-1 h-4 w-4" />
                  Download
                </a>
              <% end %>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    """
  end

  @doc """
  Formats bytes to human-readable size.

  ## Examples

      iex> format_size(1024)
      "1.0 KB"

      iex> format_size(1_073_741_824)
      "1.0 GB"
  """
  def format_size(nil), do: "N/A"

  def format_size(bytes) when is_integer(bytes) do
    cond do
      bytes >= 1_099_511_627_776 -> "#{Float.round(bytes / 1_099_511_627_776, 2)} TB"
      bytes >= 1_073_741_824 -> "#{Float.round(bytes / 1_073_741_824, 2)} GB"
      bytes >= 1_048_576 -> "#{Float.round(bytes / 1_048_576, 2)} MB"
      bytes >= 1024 -> "#{Float.round(bytes / 1024, 2)} KB"
      true -> "#{bytes} B"
    end
  end

  def format_size(_), do: "N/A"
end
