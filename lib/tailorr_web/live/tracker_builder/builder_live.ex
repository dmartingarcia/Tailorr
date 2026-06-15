defmodule TailorrWeb.TrackerBuilder.BuilderLive do
  @moduledoc """
  LiveView for visually building tracker definitions.

  Features:
  - Load tracker page in browser preview
  - Click elements to extract CSS selectors
  - Generate YAML definition
  - Test parsing with live results

  SRP: Only UI state management. Delegates to:
  - Tailorr.Browser for screenshot/navigation
  - Tailorr.Builder for YAML generation/validation

  DIP: Uses compile-time config for dependency injection (mockable in tests).
  """
  use TailorrWeb, :live_view

  alias Tailorr.Trackers

  @browser_adapter Application.compile_env(:tailorr, :browser_adapter, Tailorr.Browser)
  @builder_context Application.compile_env(:tailorr, :builder_context, Tailorr.Builder)

  @impl true
  def mount(%{"tracker_id" => id}, _session, socket) do
    # Edit mode: load existing tracker
    case Trackers.get_definition(id) do
      {:ok, tracker} ->
        socket =
          socket
          |> assign(:mode, :edit)
          |> assign(:tracker_id, id)
          |> assign(:tracker_config, tracker)
          |> assign_initial_state()

        {:ok, socket}

      {:error, :not_found} ->
        {:ok,
         socket |> put_flash(:error, "Tracker not found") |> push_navigate(to: ~p"/ui/builder")}
    end
  end

  def mount(_params, _session, socket) do
    # New tracker mode
    socket =
      socket
      |> assign(:mode, :new)
      |> assign(:tracker_id, nil)
      |> assign(:tracker_config, %{})
      |> assign_initial_state()

    {:ok, socket}
  end

  defp assign_initial_state(socket) do
    socket
    |> assign(:url, "")
    |> assign(:screenshot, nil)
    |> assign(:selectors, %{})
    |> assign(:selecting_field, nil)
    |> assign(:yaml_preview, nil)
    |> assign(:test_results, [])
    |> assign(:loading, false)
    |> assign(:browser_session, nil)
  end

  @impl true
  def handle_event("load_page", %{"url" => url}, socket) do
    send(self(), {:navigate_to, url})

    socket =
      socket
      |> assign(:loading, true)
      |> assign(:url, url)

    {:noreply, socket}
  end

  @impl true
  def handle_event("select_field", %{"field" => field}, socket) do
    {:noreply, assign(socket, :selecting_field, field)}
  end

  @impl true
  def handle_event("click_screenshot", %{"x" => x, "y" => y}, socket) do
    if socket.assigns.selecting_field do
      send(self(), {:extract_selector, socket.assigns.selecting_field, x, y})
      {:noreply, assign(socket, :loading, true)}
    else
      {:noreply, put_flash(socket, :info, "Select a field first (Title, Size, etc.)")}
    end
  end

  @impl true
  def handle_event("test_parse", _params, socket) do
    send(self(), :run_test_parse)
    {:noreply, assign(socket, :loading, true)}
  end

  @impl true
  def handle_event("save_tracker", _params, socket) do
    yaml = socket.assigns.yaml_preview

    case @builder_context.save_definition(
           yaml,
           socket.assigns.tracker_id || generate_tracker_id()
         ) do
      :ok ->
        {:noreply,
         socket
         |> put_flash(:info, "Tracker saved successfully!")
         |> push_navigate(to: ~p"/ui/test")}

      {:error, reason} ->
        {:noreply, put_flash(socket, :error, "Save failed: #{inspect(reason)}")}
    end
  end

  @impl true
  def handle_info({:navigate_to, url}, socket) do
    socket =
      case @browser_adapter.new_session() do
        {:ok, session} ->
          case @browser_adapter.navigate(session, url) do
            {:ok, screenshot} ->
              @browser_adapter.close_session(session)

              socket
              |> assign(:loading, false)
              |> assign(:screenshot, "data:image/png;base64,#{screenshot}")

            {:error, _} ->
              @browser_adapter.close_session(session)

              socket
              |> assign(:loading, false)
              |> put_flash(:error, "Failed to load page")
          end

        {:error, _} ->
          socket
          |> assign(:loading, false)
          |> put_flash(:error, "Browser service unavailable")
      end

    {:noreply, socket}
  end

  @impl true
  def handle_info({:extract_selector, field, _x, _y}, socket) do
    # Selector extraction via browser - simulated for now
    selector = "td.#{field} a"

    selectors = Map.put(socket.assigns.selectors, field, selector)
    yaml = generate_yaml_preview(selectors, socket.assigns.tracker_config)

    socket =
      socket
      |> assign(:selectors, selectors)
      |> assign(:yaml_preview, yaml)
      |> assign(:selecting_field, nil)
      |> assign(:loading, false)
      |> put_flash(:info, "Selector extracted: #{selector}")

    {:noreply, socket}
  end

  @impl true
  def handle_info(:run_test_parse, socket) do
    # Live test parsing - placeholder implementation
    socket =
      socket
      |> assign(:loading, false)
      |> assign(:test_results, [])
      |> put_flash(:info, "Test parsing coming soon")

    {:noreply, socket}
  end

  defp generate_yaml_preview(selectors, config) do
    """
    id: #{config[:id] || "new_tracker"}
    name: #{config[:name] || "New Tracker"}
    agent: #{config[:agent] || "http"}

    search:
      url: "https://example.com/search?q={query}"

    parsing:
      result_rows: "tr.result"
      fields:
        title: "#{selectors["title"] || "td.title a"}"
        download_url: "#{selectors["download"] || "td.download a::attr(href)"}"
        size: "#{selectors["size"] || "td.size"}"
        seeders: "#{selectors["seeders"] || "td.seeds"}"
        leechers: "#{selectors["leechers"] || "td.leeches"}"
    """
  end

  defp generate_tracker_id do
    "tracker_#{:erlang.unique_integer([:positive])}"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-zinc-900">
          <%= if @mode == :edit, do: "Edit Tracker: #{@tracker_id}", else: "New Tracker Builder" %>
        </h1>
        <p class="mt-2 text-sm text-zinc-600">
          Point and click to extract selectors from tracker pages
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Left Panel: Controls -->
        <div class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-900 mb-4">1. Load Page</h2>
            <.simple_form for={%{}} phx-submit="load_page">
              <.input
                type="text"
                name="url"
                label="Tracker search URL"
                value={@url}
                placeholder="https://tracker.example.com/search?q=test"
                required
              />
              <:actions>
                <.button type="submit" disabled={@loading}>
                  <%= if @loading, do: "Loading...", else: "Load Page" %>
                </.button>
              </:actions>
            </.simple_form>
          </div>

          <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-900 mb-4">2. Select Fields</h2>
            <div class="space-y-2">
              <%= for field <- ["title", "size", "seeders", "leechers", "download"] do %>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-zinc-700 capitalize"><%= field %></span>
                  <div class="flex items-center gap-2">
                    <%= if @selectors[field] do %>
                      <code class="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                        <%= @selectors[field] %>
                      </code>
                    <% end %>
                    <.button
                      type="button"
                      phx-click="select_field"
                      phx-value-field={field}
                      class={[
                        "text-xs",
                        @selecting_field == field && "bg-blue-600"
                      ]}
                    >
                      <%= if @selecting_field == field, do: "Click element →", else: "Select" %>
                    </.button>
                  </div>
                </div>
              <% end %>
            </div>
          </div>

          <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-900 mb-4">3. Test & Save</h2>
            <div class="flex gap-2">
              <.button type="button" phx-click="test_parse" disabled={@loading || map_size(@selectors) == 0}>
                Test Parse
              </.button>
              <.button type="button" phx-click="save_tracker" disabled={map_size(@selectors) == 0}>
                Save Tracker
              </.button>
            </div>
          </div>
        </div>

        <!-- Right Panel: Preview -->
        <div class="space-y-6">
          <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-900 mb-4">Browser Preview</h2>
            <%= if @screenshot do %>
              <div
                class="relative border border-zinc-300 rounded overflow-hidden cursor-crosshair"
                phx-click="click_screenshot"
              >
                <img src={@screenshot} alt="Page screenshot" class="w-full" />
                <%= if @selecting_field do %>
                  <div class="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none">
                    <div class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Click to select: <%= @selecting_field %>
                    </div>
                  </div>
                <% end %>
              </div>
            <% else %>
              <div class="flex h-64 items-center justify-center rounded border-2 border-dashed border-zinc-300 bg-zinc-50">
                <p class="text-sm text-zinc-500">Load a page to see preview</p>
              </div>
            <% end %>
          </div>

          <%= if @yaml_preview do %>
            <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 class="text-lg font-semibold text-zinc-900 mb-4">Generated YAML</h2>
              <pre class="text-xs bg-zinc-900 text-green-400 p-4 rounded overflow-x-auto"><%= @yaml_preview %></pre>
            </div>
          <% end %>
        </div>
      </div>
    </div>
    """
  end
end
