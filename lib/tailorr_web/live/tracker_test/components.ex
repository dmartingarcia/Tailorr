defmodule TailorrWeb.TrackerTest.Components do
  @moduledoc """
  Reusable components for Tracker Test UI.

  SRP: Only presentation logic, no business logic.
  """
  use Phoenix.Component

  import TailorrWeb.CoreComponents

  # ---------------------------------------------------------------------------
  # Tracker health strip
  # ---------------------------------------------------------------------------

  @doc """
  Renders a compact strip of per-tracker status chips.

  Each chip shows whether the tracker is working, and provides a reset button
  when the circuit breaker has opened.
  """
  attr :trackers, :list, required: true

  def tracker_health(assigns) do
    ~H"""
    <div :if={length(@trackers) > 0} class="mt-5 flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground select-none">
        Trackers
      </span>
      <.tracker_chip :for={tracker <- @trackers} tracker={tracker} />
    </div>
    """
  end

  defp tracker_chip(%{tracker: %{circuit_state: :open}} = assigns) do
    ~H"""
    <div class="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
      <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
      <span><%= @tracker.name %></span>
      <span class="opacity-60">· not working</span>
      <button
        phx-click="reset_circuit"
        phx-value-tracker={@tracker.id}
        class="ml-0.5 rounded px-1 py-0.5 font-semibold opacity-70 transition-all hover:opacity-100 hover:bg-rose-500/20"
        title="Reset circuit breaker"
      >
        Reset
      </button>
    </div>
    """
  end

  defp tracker_chip(%{tracker: %{circuit_state: :half_open}} = assigns) do
    ~H"""
    <div class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
      <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"></span>
      <span><%= @tracker.name %></span>
      <span class="opacity-60">· recovering</span>
    </div>
    """
  end

  defp tracker_chip(%{tracker: %{failure_count: n}} = assigns) when n > 0 do
    ~H"""
    <div class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
      <span><%= @tracker.name %></span>
      <span class="opacity-60">· <%= @tracker.failure_count %> error(s)</span>
    </div>
    """
  end

  defp tracker_chip(assigns) do
    ~H"""
    <div class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      <span><%= @tracker.name %></span>
    </div>
    """
  end

  # ---------------------------------------------------------------------------
  # Results table
  # ---------------------------------------------------------------------------

  @doc """
  Renders a table of search results.
  """
  attr :results, :list, required: true

  def results_table(assigns) do
    ~H"""
    <div class="overflow-hidden rounded-lg border border-border shadow-sm">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted/50">
          <tr>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Title
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Size
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Seeds
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Tracker
            </th>
            <th scope="col" class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Download
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border bg-background">
          <tr :for={result <- @results} class="hover:bg-muted/30 transition-colors">
            <td class="px-3 py-4 text-sm text-foreground">
              <%= if result.detail_url do %>
                <a href={result.detail_url} target="_blank" class="font-medium text-primary hover:underline">
                  <%= result.title %>
                </a>
              <% else %>
                <%= result.title %>
              <% end %>
            </td>
            <td class="px-3 py-4 text-sm text-muted-foreground">
              <%= format_size(result.size_bytes) %>
            </td>
            <td class="px-3 py-4 text-sm text-muted-foreground">
              <span class="inline-flex items-center gap-1">
                <span class="text-emerald-600 dark:text-emerald-400 font-medium"><%= result.seeders || 0 %></span>
                <span class="text-muted-foreground/40">/</span>
                <span class="text-rose-600 dark:text-rose-400"><%= result.leechers || 0 %></span>
              </span>
            </td>
            <td class="px-3 py-4 text-sm text-muted-foreground">
              <span class="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                <%= result.tracker_id %>
              </span>
            </td>
            <td class="px-3 py-4 text-sm">
              <%= cond do %>
                <% result.magnet_url -> %>
                  <a
                    href={result.magnet_url}
                    class="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <.icon name="hero-arrow-down-tray" class="mr-1 h-4 w-4" />
                    Magnet
                  </a>
                <% result.download_url -> %>
                  <a
                    href={result.download_url}
                    target="_blank"
                    class="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <.icon name="hero-arrow-down-tray" class="mr-1 h-4 w-4" />
                    Download
                  </a>
                <% result.detail_url -> %>
                  <a
                    href={result.detail_url}
                    target="_blank"
                    class="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <.icon name="hero-arrow-top-right-on-square" class="mr-1 h-4 w-4" />
                    View
                  </a>
                <% true -> %>
                  <span class="text-xs text-muted-foreground/50">—</span>
              <% end %>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    """
  end

  @doc false
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
