defmodule TailorrWeb.TrackerTest.TestLive do
  @moduledoc """
  LiveView for testing tracker searches.

  SRP: Only handles UI state and events. Business logic delegated to Tailorr.Trackers.
  """
  use TailorrWeb, :live_view

  alias Tailorr.Trackers

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:trackers, Trackers.list_all())
     |> assign(:selected_tracker, "all")
     |> assign(:query, "")
     |> assign(:results, [])
     |> assign(:loading, false)
     |> assign(:pending_count, 0)
     |> assign(:tracker_errors, [])
     |> assign(:skipped_trackers, [])
     |> assign(:error, nil)}
  end

  @impl true
  def handle_event("search", %{"query" => query, "tracker" => tracker_id}, socket) do
    if query == "" do
      {:noreply, put_flash(socket, :error, "Please enter a search query")}
    else
      send(self(), {:run_search, query, tracker_id})

      {:noreply,
       socket
       |> assign(:loading, true)
       |> assign(:query, query)
       |> assign(:selected_tracker, tracker_id)
       |> assign(:results, [])
       |> assign(:tracker_errors, [])
       |> assign(:skipped_trackers, [])
       |> assign(:error, nil)}
    end
  end

  @impl true
  def handle_event("reset_circuit", %{"tracker" => tracker_id}, socket) do
    case Trackers.reset_circuit(tracker_id) do
      :ok ->
        tracker_name =
          case Enum.find(socket.assigns.trackers, &(&1.id == tracker_id)) do
            nil -> tracker_id
            t -> t.name
          end

        {:noreply,
         socket
         |> assign(:trackers, Trackers.list_all())
         |> put_flash(:info, "#{tracker_name} reset — will retry on next search")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Could not reset tracker")}
    end
  end

  # "All trackers" — one Task per tracker, each reports back independently
  @impl true
  def handle_info({:run_search, query, "all"}, socket) do
    pid = self()
    trackers = Trackers.list_all()

    Enum.each(trackers, fn tracker ->
      Task.start(fn ->
        outcome =
          try do
            Trackers.search(tracker.id, query)
          rescue
            error -> {:error, Exception.message(error)}
          catch
            :exit, reason -> {:error, reason}
          end

        send(pid, {:tracker_finished, tracker.id, tracker.name, outcome})
      end)
    end)

    {:noreply, assign(socket, :pending_count, length(trackers))}
  end

  # Single tracker
  @impl true
  def handle_info({:run_search, query, tracker_id}, socket) do
    pid = self()

    tracker_name =
      case Enum.find(socket.assigns.trackers, &(&1.id == tracker_id)) do
        nil -> tracker_id
        t -> t.name
      end

    Task.start(fn ->
      outcome =
        try do
          Trackers.search(tracker_id, query)
        rescue
          error -> {:error, Exception.message(error)}
        catch
          :exit, reason -> {:error, reason}
        end

      send(pid, {:tracker_finished, tracker_id, tracker_name, outcome})
    end)

    {:noreply, assign(socket, :pending_count, 1)}
  end

  @impl true
  def handle_info({:tracker_finished, _id, _name, {:ok, new_results}}, socket) do
    pending = max(0, socket.assigns.pending_count - 1)

    {:noreply,
     socket
     |> assign(:results, socket.assigns.results ++ new_results)
     |> assign(:pending_count, pending)
     |> assign(:loading, pending > 0)
     |> maybe_refresh_trackers(pending)}
  end

  @impl true
  def handle_info({:tracker_finished, _id, name, {:error, :circuit_open}}, socket) do
    pending = max(0, socket.assigns.pending_count - 1)

    {:noreply,
     socket
     |> assign(:skipped_trackers, socket.assigns.skipped_trackers ++ [name])
     |> assign(:pending_count, pending)
     |> assign(:loading, pending > 0)
     |> maybe_refresh_trackers(pending)}
  end

  @impl true
  def handle_info({:tracker_finished, _id, name, {:error, reason}}, socket) do
    pending = max(0, socket.assigns.pending_count - 1)

    {:noreply,
     socket
     |> assign(:tracker_errors, socket.assigns.tracker_errors ++ [%{tracker: name, reason: format_error(reason)}])
     |> assign(:pending_count, pending)
     |> assign(:loading, pending > 0)
     |> maybe_refresh_trackers(pending)}
  end

  # Refresh tracker list when all searches complete so circuit state reflects reality
  defp maybe_refresh_trackers(socket, 0), do: assign(socket, :trackers, Trackers.list_all())
  defp maybe_refresh_trackers(socket, _), do: socket

  defp format_error({:http_error, 429}), do: "429 Too Many Requests"
  defp format_error({:http_error, 403}), do: "403 Forbidden"
  defp format_error({:http_error, 404}), do: "404 Not Found"
  defp format_error({:http_error, 503}), do: "503 Service Unavailable"
  defp format_error({:http_error, code}), do: "HTTP #{code}"
  defp format_error({:rate_limit_exceeded, mins}), do: "Rate limited (wait #{mins}m)"
  defp format_error(%{reason: :timeout}), do: "Timeout"
  defp format_error(%{reason: :econnrefused}), do: "Connection refused"
  defp format_error(%{reason: :nxdomain}), do: "Host not found"
  defp format_error(:timeout), do: "Timeout"
  defp format_error(reason) when is_binary(reason), do: reason
  defp format_error(reason), do: inspect(reason)

  defp tracker_option_label(%{circuit_state: :open} = t), do: "#{t.name} — not working"
  defp tracker_option_label(%{circuit_state: :half_open} = t), do: "#{t.name} — recovering"
  defp tracker_option_label(t), do: t.name

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Tracker Search</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Search across your configured trackers
        </p>
      </div>

      <.simple_form for={%{}} phx-submit="search">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="sm:col-span-1">
            <.input
              type="select"
              name="tracker"
              label="Tracker"
              value={@selected_tracker}
              options={
                [{"All trackers", "all"}] ++
                  Enum.map(@trackers, &{tracker_option_label(&1), &1.id})
              }
            />
          </div>
          <div class="sm:col-span-2">
            <.input
              type="text"
              name="query"
              label="Search query"
              value={@query}
              placeholder="e.g. breaking bad"
              required
            />
          </div>
        </div>
        <:actions>
          <.button type="submit" disabled={@loading}>
            <%= if @loading do %>
              <span class="inline-flex items-center">
                <.icon name="hero-arrow-path" class="mr-2 h-4 w-4 animate-spin" />
                <%= if @pending_count > 0 do %>
                  Searching (<%= @pending_count %> left)…
                <% else %>
                  Searching…
                <% end %>
              </span>
            <% else %>
              Search
            <% end %>
          </.button>
        </:actions>
      </.simple_form>

      <%!-- Tracker health strip — always visible --%>
      <TailorrWeb.TrackerTest.Components.tracker_health trackers={@trackers} />

      <%!-- Skipped trackers notice --%>
      <div :if={length(@skipped_trackers) > 0} class="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300">
        <.icon name="hero-exclamation-triangle" class="h-4 w-4 shrink-0" />
        <span>
          Skipped: <span class="font-medium"><%= Enum.join(@skipped_trackers, ", ") %></span>
          — not working right now. Reset them from the status strip above.
        </span>
      </div>

      <%!-- Tracker search errors --%>
      <div :if={length(@tracker_errors) > 0} class="mt-3 space-y-1">
        <div
          :for={err <- @tracker_errors}
          class="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-sm text-destructive"
        >
          <.icon name="hero-x-circle" class="h-4 w-4 shrink-0" />
          <span class="font-medium"><%= err.tracker %></span>
          <span class="opacity-50">·</span>
          <span><%= err.reason %></span>
        </div>
      </div>

      <%!-- Results --%>
      <%= if length(@results) > 0 do %>
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-foreground mb-4">
            Results (<%= length(@results) %>)
            <span :if={@loading} class="text-sm font-normal text-muted-foreground">
              — loading more…
            </span>
          </h2>
          <TailorrWeb.TrackerTest.Components.results_table results={@results} />
        </div>
      <% else %>
        <div :if={!@loading && @query != ""} class="mt-8 text-center text-muted-foreground">
          <p>No results found</p>
        </div>
      <% end %>
    </div>
    """
  end
end
