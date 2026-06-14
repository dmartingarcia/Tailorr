defmodule TailorrWeb.TrackerTest.TestLive do
  @moduledoc """
  LiveView for testing tracker searches.

  Allows users to:
  - Select a tracker (or "all")
  - Enter a search query
  - View results in a table

  SRP: Only handles UI state and events. Business logic delegated to Tailorr.Trackers.
  """
  use TailorrWeb, :live_view

  alias Tailorr.Trackers

  @impl true
  def mount(_params, _session, socket) do
    trackers = Trackers.list_all()

    socket =
      socket
      |> assign(:trackers, trackers)
      |> assign(:selected_tracker, "all")
      |> assign(:query, "")
      |> assign(:results, [])
      |> assign(:loading, false)
      |> assign(:error, nil)

    {:ok, socket}
  end

  @impl true
  def handle_event("search", %{"query" => query, "tracker" => tracker_id}, socket) do
    if query == "" do
      {:noreply, put_flash(socket, :error, "Please enter a search query")}
    else
      # Start search in background to avoid blocking
      send(self(), {:run_search, query, tracker_id})

      socket =
        socket
        |> assign(:loading, true)
        |> assign(:query, query)
        |> assign(:selected_tracker, tracker_id)
        |> assign(:error, nil)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_info({:run_search, query, tracker_id}, socket) do
    results =
      try do
        if tracker_id == "all" do
          Trackers.search_all(query)
        else
          case Trackers.search(tracker_id, query) do
            {:ok, results} -> results
            {:error, reason} -> raise "Search failed: #{inspect(reason)}"
          end
        end
      rescue
        error ->
          socket = put_flash(socket, :error, "Search failed: #{Exception.message(error)}")
          assign(socket, :error, Exception.message(error))
          []
      end

    socket =
      socket
      |> assign(:results, results)
      |> assign(:loading, false)

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-zinc-900">Tracker Search</h1>
        <p class="mt-2 text-sm text-zinc-600">
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
              options={[{"All trackers", "all"}] ++ Enum.map(@trackers, &{&1.name, &1.id})}
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
                Searching...
              </span>
            <% else %>
              Search
            <% end %>
          </.button>
        </:actions>
      </.simple_form>

      <%= if @error do %>
        <div class="mt-4 rounded-lg bg-rose-50 p-4 text-rose-800">
          <p class="text-sm"><%= @error %></p>
        </div>
      <% end %>

      <%= if length(@results) > 0 do %>
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-zinc-900 mb-4">
            Results (<%= length(@results) %>)
          </h2>
          <TailorrWeb.TrackerTest.Components.results_table results={@results} />
        </div>
      <% else %>
        <%= if !@loading && @query != "" do %>
          <div class="mt-8 text-center text-zinc-500">
            <p>No results found</p>
          </div>
        <% end %>
      <% end %>
    </div>
    """
  end
end
