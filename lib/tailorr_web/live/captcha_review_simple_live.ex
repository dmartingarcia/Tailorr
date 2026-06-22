defmodule TailorrWeb.CaptchaReviewSimpleLive do
  @moduledoc """
  LiveView simple para revisar y catalogar CAPTCHAs desde archivos.

  Lee directamente del filesystem:
  - priv/static/ml/captchas/TRACKER/failed/*.jpg
  - priv/static/ml/captchas/TRACKER/pending/*.jpg
  - priv/static/ml/captchas/TRACKER/success/*_SOLUTION.jpg
  """

  use TailorrWeb, :live_view
  alias Tailorr.Captcha.FileStorage

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      # Asegurar que existen los directorios
      FileStorage.init()

      trackers = FileStorage.list_trackers()
      selected_tracker = List.first(trackers)

      socket =
        socket
        |> assign(
          loading: false,
          trackers: trackers,
          selected_tracker: selected_tracker,
          pending_examples: FileStorage.list_pending(selected_tracker),
          failed_examples: FileStorage.list_failed(selected_tracker),
          success_examples: FileStorage.list_success(selected_tracker),
          classified_examples: FileStorage.list_classified(selected_tracker),
          current_example: nil,
          tab: "pending",
          stats: FileStorage.stats()
        )

      {:ok, socket}
    else
      {:ok, assign(socket, loading: true)}
    end
  end

  @impl true
  def handle_event("select_example", %{"filename" => filename, "tab" => tab}, socket) do
    example =
      case tab do
        "pending" -> Enum.find(socket.assigns.pending_examples, &(&1.filename == filename))
        "failed" -> Enum.find(socket.assigns.failed_examples, &(&1.filename == filename))
        "success" -> Enum.find(socket.assigns.success_examples, &(&1.filename == filename))
        "classified" -> Enum.find(socket.assigns.classified_examples, &(&1.filename == filename))
      end

    {:noreply, assign(socket, current_example: example, tab: tab)}
  end

  @impl true
  def handle_event("classify", params, socket) do
    %{
      "filename" => filename,
      "solution" => solution,
      "category" => category,
      "notes" => notes
    } = params

    tracker = socket.assigns.selected_tracker || "unknown"

    case FileStorage.classify(tracker, filename,
           solution: solution,
           category: category,
           notes: notes
         ) do
      {:ok, _path} ->
        socket =
          socket
          |> put_flash(:info, "CAPTCHA clasificado: #{category}")
          |> reload_data()
          |> assign(current_example: nil)

        {:noreply, socket}

      {:error, :file_not_found} ->
        {:noreply, put_flash(socket, :error, "Archivo no encontrado")}
    end
  end

  @impl true
  def handle_event("change_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, tab: tab, current_example: nil)}
  end

  @impl true
  def handle_event("change_tracker", %{"tracker" => tracker}, socket) do
    socket =
      socket
      |> assign(selected_tracker: tracker, current_example: nil)
      |> reload_data()

    {:noreply, socket}
  end

  @impl true
  def handle_event("export", %{"quality" => _quality}, socket) do
    tracker = socket.assigns.selected_tracker
    lv_pid = self()

    Task.start(fn ->
      result =
        if tracker do
          FileStorage.export_training_data(tracker: tracker)
        else
          FileStorage.export_training_data()
        end

      send(lv_pid, {:export_done, result})
    end)

    {:noreply, put_flash(socket, :info, "Exportando datos...")}
  end

  @impl true
  def handle_event("refresh", _, socket) do
    {:noreply, reload_data(socket)}
  end

  @impl true
  def handle_info({:export_done, {:ok, count}}, socket) do
    {:noreply, put_flash(socket, :info, "Exportacion completada: #{count} ejemplos")}
  end

  @impl true
  def handle_info({:export_done, {:error, reason}}, socket) do
    {:noreply, put_flash(socket, :error, "Error al exportar: #{inspect(reason)}")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <%= if @loading do %>
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <p class="text-gray-500">Loading...</p>
      </div>
    <% else %>
      <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">CAPTCHA Review</h1>
            <p class="text-gray-600 mt-1">Clasifica CAPTCHAs para entrenar el modelo</p>
          </div>

          <!-- Tracker selector -->
          <%= if length(@trackers) > 0 do %>
            <div class="bg-white rounded-lg shadow p-4 mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tracker / Dominio
              </label>
              <select
                phx-change="change_tracker"
                name="tracker"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Todos los trackers --</option>
                <%= for tracker <- @trackers do %>
                  <option value={tracker} selected={tracker == @selected_tracker}>
                    <%= tracker %> <%= tracker_badge(@stats, tracker) %>
                  </option>
                <% end %>
              </select>
            </div>
          <% end %>

          <!-- Stats -->
          <.stats_panel stats={@stats} selected_tracker={@selected_tracker} />

          <!-- Toolbar -->
          <div class="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
            <button
              phx-click="export"
              phx-value-quality="all"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Exportar Training Data <%= if @selected_tracker, do: "(#{@selected_tracker})", else: "(Todos)" %>
            </button>
            <button
              phx-click="refresh"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Refrescar
            </button>
          </div>

          <!-- Content -->
          <div class="grid grid-cols-3 gap-6">
            <!-- List -->
            <div class="col-span-1">
              <div class="bg-white rounded-lg shadow">
                <!-- Tabs -->
                <div class="border-b border-gray-200 flex">
                  <button
                    phx-click="change_tab"
                    phx-value-tab="pending"
                    class={tab_class(@tab == "pending")}
                  >
                    Pendientes (<%= length(@pending_examples) %>)
                  </button>
                  <button
                    phx-click="change_tab"
                    phx-value-tab="failed"
                    class={tab_class(@tab == "failed")}
                  >
                    Fallidos (<%= length(@failed_examples) %>)
                  </button>
                  <button
                    phx-click="change_tab"
                    phx-value-tab="success"
                    class={tab_class(@tab == "success")}
                  >
                    Exitosos (<%= length(@success_examples) %>)
                  </button>
                  <button
                    phx-click="change_tab"
                    phx-value-tab="classified"
                    class={tab_class(@tab == "classified")}
                  >
                    Clasificados (<%= length(@classified_examples) %>)
                  </button>
                </div>

                <!-- List -->
                <div class="max-h-[600px] overflow-y-auto divide-y">
                  <%= if @tab == "pending" do %>
                    <%= for example <- @pending_examples do %>
                      <.example_item example={example} tab="pending" current={@current_example} />
                    <% end %>
                  <% end %>

                  <%= if @tab == "failed" do %>
                    <%= for example <- @failed_examples do %>
                      <.example_item example={example} tab="failed" current={@current_example} />
                    <% end %>
                  <% end %>

                  <%= if @tab == "success" do %>
                    <%= for example <- @success_examples do %>
                      <.example_item example={example} tab="success" current={@current_example} />
                    <% end %>
                  <% end %>

                  <%= if @tab == "classified" do %>
                    <%= for example <- @classified_examples do %>
                      <.example_item example={example} tab="classified" current={@current_example} />
                    <% end %>
                  <% end %>
                </div>
              </div>
            </div>

            <!-- Detail -->
            <div class="col-span-2">
              <%= if @current_example do %>
                <.detail_view example={@current_example} tab={@tab} />
              <% else %>
                <div class="bg-white rounded-lg shadow p-12 text-center">
                  <p class="text-gray-600">Selecciona un CAPTCHA para revisar</p>
                </div>
              <% end %>
            </div>
          </div>
        </div>
      </div>
    <% end %>
    """
  end

  # Components

  defp stats_panel(assigns) do
    tracker_stats =
      if assigns.selected_tracker do
        Map.get(assigns.stats.by_tracker || %{}, assigns.selected_tracker, %{
          success: 0,
          failed: 0,
          classified: 0
        })
      else
        assigns.stats.total || %{success: 0, failed: 0, classified: 0}
      end

    assigns = assign(assigns, :tracker_stats, tracker_stats)

    ~H"""
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total</div>
        <div class="text-2xl font-bold">
          <%= @tracker_stats[:success] + @tracker_stats[:failed] + @tracker_stats[:classified] %>
        </div>
      </div>
      <div class="bg-yellow-50 rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Fallidos</div>
        <div class="text-2xl font-bold text-yellow-800"><%= @tracker_stats[:failed] %></div>
      </div>
      <div class="bg-green-50 rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Exitosos</div>
        <div class="text-2xl font-bold text-green-800"><%= @tracker_stats[:success] %></div>
      </div>
      <div class="bg-purple-50 rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Clasificados</div>
        <div class="text-2xl font-bold text-purple-800"><%= @tracker_stats[:classified] %></div>
      </div>
    </div>
    """
  end

  defp tracker_badge(stats, tracker) do
    tracker_stats = Map.get(stats.by_tracker || %{}, tracker, %{})

    total =
      (tracker_stats[:success] || 0) + (tracker_stats[:failed] || 0) +
        (tracker_stats[:classified] || 0)

    if total > 0, do: "(#{total})", else: ""
  end

  # Components

  defp example_item(assigns) do
    selected = assigns.current && assigns.current.filename == assigns.example.filename

    assigns = assign(assigns, :selected, selected)

    ~H"""
    <div
      phx-click="select_example"
      phx-value-filename={@example.filename}
      phx-value-tab={@tab}
      class={[
        "p-4 cursor-pointer hover:bg-gray-50",
        @selected && "bg-blue-50 border-l-4 border-blue-500"
      ]}
    >
      <div class="font-mono text-sm text-gray-900"><%= @example.filename %></div>
      <%= if @example[:solution] do %>
        <div class="text-xs text-green-600 mt-1">
          Solución: <code class="bg-green-50 px-1 rounded"><%= @example.solution %></code>
        </div>
      <% end %>
      <%= if @example[:category] do %>
        <span class="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded mt-1">
          <%= @example.category %>
        </span>
      <% end %>
      <%= if @example.metadata[:ml_prediction] do %>
        <div class="text-xs text-gray-500 mt-1">
          ML: <%= @example.metadata.ml_prediction %>
          <%= if @example.metadata[:ml_confidence] do %>
            (<%= round(@example.metadata.ml_confidence * 100) %>%)
          <% end %>
        </div>
      <% end %>
    </div>
    """
  end

  defp detail_view(assigns) do
    ~H"""
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold"><%= @example.filename %></h2>
      </div>

      <div class="p-6">
        <!-- Image -->
        <div class="mb-6 border rounded-lg p-4 bg-gray-50">
          <img
            src={"/ml/captchas/#{@example.tracker}/#{path_segment(@tab)}/#{@example.filename}"}
            alt="CAPTCHA"
            class="max-w-full h-auto mx-auto"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'100\'%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3ENo image%3C/text%3E%3C/svg%3E'"
          />
        </div>

        <!-- Metadata -->
        <%= if map_size(@example.metadata) > 0 do %>
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-semibold mb-2">Metadata</h3>
            <pre class="text-xs text-gray-700 overflow-auto"><%= Jason.encode!(@example.metadata, pretty: true) %></pre>
          </div>
        <% end %>

        <!-- Classification form (solo para fallidos) -->
        <%= if @tab == "failed" do %>
          <form phx-submit="classify" class="space-y-4">
            <input type="hidden" name="filename" value={@example.filename} />

            <div>
              <label class="block text-sm font-medium mb-1">Solución Correcta</label>
              <input
                type="text"
                name="solution"
                value={@example.metadata[:ml_prediction] || ""}
                required
                class="w-full px-3 py-2 border rounded-lg font-mono text-lg"
                placeholder="ABC123"
                autofocus
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select name="category" class="w-full px-3 py-2 border rounded-lg">
                <option value="distorted">Distorsionado</option>
                <option value="noise">Ruido</option>
                <option value="low_contrast">Bajo Contraste</option>
                <option value="multiple_fonts">Multiples Fuentes</option>
                <option value="overlapping">Solapamiento</option>
                <option value="background_pattern">Patron de Fondo</option>
                <option value="unusual_chars">Caracteres Raros</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Notas</label>
              <textarea
                name="notes"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg"
                placeholder="Observaciones..."
              ><%= @example.metadata[:notes] %></textarea>
            </div>

            <button
              type="submit"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Clasificar y Guardar
            </button>
          </form>
        <% end %>

        <!-- Info only (para exitosos y clasificados) -->
        <%= if @tab in ["success", "classified"] do %>
          <div class="space-y-2">
            <div class="flex justify-between p-3 bg-green-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Solución:</span>
              <code class="text-sm font-mono text-green-900"><%= @example.solution %></code>
            </div>
            <%= if @example[:category] do %>
              <div class="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span class="text-sm font-medium text-gray-700">Categoría:</span>
                <span class="text-sm text-purple-900"><%= @example.category %></span>
              </div>
            <% end %>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  defp tab_class(active) do
    base = "flex-1 px-4 py-3 text-sm font-medium transition"

    if active do
      base <> " border-b-2 border-blue-500 text-blue-600"
    else
      base <> " text-gray-600 hover:text-gray-900"
    end
  end

  defp path_segment("pending"), do: "pending"
  defp path_segment("failed"), do: "failed"
  defp path_segment("success"), do: "success"
  defp path_segment("classified"), do: "classified"

  defp reload_data(socket) do
    tracker = socket.assigns[:selected_tracker]

    assign(socket,
      pending_examples: FileStorage.list_pending(tracker),
      failed_examples: FileStorage.list_failed(tracker),
      success_examples: FileStorage.list_success(tracker),
      classified_examples: FileStorage.list_classified(tracker),
      stats: FileStorage.stats()
    )
  end
end
