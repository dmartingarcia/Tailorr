defmodule Tailorr.Captcha.FileStorage do
  @moduledoc """
  Sistema de aprendizaje basado en archivos, organizado por tracker/dominio.

  ## Estructura de directorios

      priv/ml/captcha_learning/
        tracker1.com/
          success/
            abc123_ABC123.jpg
          failed/
            def456.jpg
          classified/
            distorted/
              ghi789_TEST.jpg
        tracker2.org/
          success/
          failed/
          classified/

  Cada tracker tiene su propio dataset para entrenar modelos específicos.

  ## Uso

      # Guardar acierto (con tracker)
      FileStorage.save_success(captcha, solution, "tracker1.com", metadata)
      #=> "priv/ml/captcha_learning/tracker1.com/success/abc123_ABC123.jpg"

      # Listar por tracker
      FileStorage.list_failed("tracker1.com")

      # Estadísticas por tracker
      FileStorage.stats_by_tracker()
      #=> %{"tracker1.com" => %{success: 50, failed: 10}, ...}
  """

  require Logger

  @default_base_dir "priv/ml/captcha_learning"
  @dirs %{
    success: "success",
    failed: "failed",
    pending: "pending",
    classified: "classified"
  }

  @doc """
  Inicializa la estructura de directorios para un tracker.
  """
  def init(tracker \\ nil) do
    if tracker do
      init_tracker_dirs(tracker)
    else
      # Inicializar para todos los trackers existentes
      list_trackers()
      |> Enum.each(&init_tracker_dirs/1)
    end

    :ok
  end

  defp init_tracker_dirs(tracker) do
    base = Path.join(base_dir(), sanitize_tracker(tracker))

    Enum.each(@dirs, fn {_key, dir} ->
      Path.join(base, dir) |> File.mkdir_p!()
    end)

    # Subdirectorios de clasificación
    categories = [
      "distorted",
      "noise",
      "low_contrast",
      "multiple_fonts",
      "overlapping",
      "background_pattern",
      "unusual_chars",
      "other"
    ]

    Enum.each(categories, fn category ->
      Path.join([base, "classified", category]) |> File.mkdir_p!()
    end)
  end

  @doc """
  Lista todos los trackers que tienen datos.
  """
  def list_trackers do
    if File.exists?(base_dir()) do
      File.ls!(base_dir())
      |> Enum.filter(fn name ->
        path = Path.join(base_dir(), name)
        File.dir?(path) && name != "export"
      end)
    else
      []
    end
  end

  @doc """
  Guarda un CAPTCHA acertado.

  El nombre del archivo incluye la solución: UUID_SOLUCIÓN.jpg
  """
  def save_success(captcha_data, solution, tracker, metadata \\ %{}) do
    init(tracker)

    uuid = generate_uuid()
    safe_solution = sanitize_filename(solution)
    filename = "#{uuid}_#{safe_solution}.jpg"

    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    filepath = Path.join([tracker_base, @dirs.success, filename])

    # Guardar imagen
    image_binary = get_image_binary(captcha_data)
    File.write!(filepath, image_binary)

    # Guardar metadata con tracker
    metadata_with_tracker = Map.put(metadata, :tracker, tracker)

    if map_size(metadata_with_tracker) > 0 do
      save_metadata(filepath, metadata_with_tracker)
    end

    Logger.info("✅ [#{tracker}] Saved success: #{filename}")
    {:ok, filepath}
  end

  @doc """
  Guarda un CAPTCHA fallido (sin solución conocida).
  """
  def save_failure(captcha_data, tracker, metadata \\ %{}) do
    init(tracker)

    uuid = generate_uuid()
    filename = "#{uuid}.jpg"

    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    filepath = Path.join([tracker_base, @dirs.failed, filename])

    # Guardar imagen
    image_binary = get_image_binary(captcha_data)
    File.write!(filepath, image_binary)

    # Guardar metadata
    metadata_with_tracker =
      metadata
      |> Map.put(:status, "failed")
      |> Map.put(:tracker, tracker)

    save_metadata(filepath, metadata_with_tracker)

    Logger.info("❌ [#{tracker}] Saved failure: #{filename}")
    {:ok, filepath}
  end

  @doc """
  Guarda un CAPTCHA pendiente de clasificación.
  """
  def save_pending(captcha_data, tracker, metadata \\ %{}) do
    init(tracker)

    uuid = generate_uuid()
    filename = "#{uuid}.jpg"

    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    filepath = Path.join([tracker_base, @dirs.pending, filename])

    # Guardar imagen
    image_binary = get_image_binary(captcha_data)
    File.write!(filepath, image_binary)

    # Guardar metadata
    metadata_with_tracker =
      metadata
      |> Map.put(:status, "pending")
      |> Map.put(:tracker, tracker)

    save_metadata(filepath, metadata_with_tracker)

    Logger.info("⏳ [#{tracker}] Saved pending: #{filename}")
    {:ok, filepath}
  end

  @doc """
  Clasifica un CAPTCHA fallido.

  Mueve de failed/ a classified/CATEGORY/ y añade la solución al nombre.
  """
  def classify(tracker, filename, opts) do
    solution = Keyword.fetch!(opts, :solution)
    category = Keyword.get(opts, :category, "other")
    notes = Keyword.get(opts, :notes)

    # Encontrar archivo original
    source_path = find_file(tracker, filename)

    if source_path do
      # Nuevo nombre con solución
      uuid = extract_uuid(filename)
      safe_solution = sanitize_filename(solution)
      new_filename = "#{uuid}_#{safe_solution}.jpg"

      # Mover a carpeta clasificada
      tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
      dest_path = Path.join([tracker_base, "classified", category, new_filename])
      File.mkdir_p!(Path.dirname(dest_path))
      File.rename!(source_path, dest_path)

      # Actualizar metadata
      update_metadata(dest_path, %{
        classified: true,
        category: category,
        solution: solution,
        notes: notes,
        classified_at: DateTime.utc_now() |> DateTime.to_iso8601()
      })

      Logger.info("📁 [#{tracker}] Classified: #{filename} -> #{category}/#{new_filename}")
      {:ok, dest_path}
    else
      {:error, :file_not_found}
    end
  end

  @doc """
  Lista archivos fallidos que necesitan revisión.
  """
  def list_failed(tracker \\ nil) do
    if tracker do
      list_failed_for_tracker(tracker)
    else
      # Listar todos los trackers
      list_trackers()
      |> Enum.flat_map(&list_failed_for_tracker/1)
    end
  end

  defp list_failed_for_tracker(tracker) do
    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    failed_dir = Path.join(tracker_base, @dirs.failed)

    if File.exists?(failed_dir) do
      File.ls!(failed_dir)
      |> Enum.filter(&String.ends_with?(&1, ".jpg"))
      |> Enum.map(fn filename ->
        filepath = Path.join(failed_dir, filename)
        metadata = load_metadata(filepath)

        %{
          tracker: tracker,
          filename: filename,
          uuid: extract_uuid(filename),
          path: filepath,
          metadata: metadata,
          inserted_at: file_mtime(filepath)
        }
      end)
      |> Enum.sort_by(& &1.inserted_at, {:desc, DateTime})
    else
      []
    end
  end

  @doc """
  Lista archivos exitosos.
  """
  def list_success(tracker \\ nil) do
    if tracker do
      list_success_for_tracker(tracker)
    else
      list_trackers()
      |> Enum.flat_map(&list_success_for_tracker/1)
    end
  end

  defp list_success_for_tracker(tracker) do
    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    success_dir = Path.join(tracker_base, @dirs.success)

    if File.exists?(success_dir) do
      File.ls!(success_dir)
      |> Enum.filter(&String.ends_with?(&1, ".jpg"))
      |> Enum.map(fn filename ->
        filepath = Path.join(success_dir, filename)
        {uuid, solution} = parse_success_filename(filename)
        metadata = load_metadata(filepath)

        %{
          tracker: tracker,
          filename: filename,
          uuid: uuid,
          solution: solution,
          path: filepath,
          metadata: metadata,
          inserted_at: file_mtime(filepath)
        }
      end)
      |> Enum.sort_by(& &1.inserted_at, {:desc, DateTime})
    else
      []
    end
  end

  @doc """
  Lista archivos clasificados por categoría.
  """
  def list_classified(tracker \\ nil, category \\ nil) do
    if tracker do
      list_classified_for_tracker(tracker, category)
    else
      list_trackers()
      |> Enum.flat_map(&list_classified_for_tracker(&1, category))
    end
  end

  defp list_classified_for_tracker(tracker, category) do
    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))
    classified_dir = Path.join(tracker_base, "classified")

    categories = classified_categories(classified_dir, category)

    categories
    |> Enum.flat_map(&list_category_files(tracker, classified_dir, &1))
    |> Enum.sort_by(& &1.inserted_at, {:desc, DateTime})
  end

  defp classified_categories(classified_dir, nil) do
    if File.exists?(classified_dir) do
      classified_dir
      |> File.ls!()
      |> Enum.filter(&File.dir?(Path.join(classified_dir, &1)))
    else
      []
    end
  end

  defp classified_categories(_classified_dir, category), do: [category]

  defp list_category_files(tracker, classified_dir, cat) do
    cat_dir = Path.join(classified_dir, cat)

    if File.exists?(cat_dir) do
      cat_dir
      |> File.ls!()
      |> Enum.filter(&String.ends_with?(&1, ".jpg"))
      |> Enum.map(&build_classified_entry(tracker, cat_dir, cat, &1))
    else
      []
    end
  end

  defp build_classified_entry(tracker, cat_dir, cat, filename) do
    filepath = Path.join(cat_dir, filename)
    {uuid, solution} = parse_success_filename(filename)
    metadata = load_metadata(filepath)

    %{
      tracker: tracker,
      filename: filename,
      uuid: uuid,
      solution: solution,
      category: cat,
      path: filepath,
      metadata: metadata,
      inserted_at: file_mtime(filepath)
    }
  end

  @doc """
  Exporta datos de entrenamiento en formato estándar.

  Genera labels.txt con formato: filename TAB solution

  Si se especifica tracker, solo exporta ese tracker.
  Si no, exporta todos los trackers en subdirectorios.
  """
  def export_training_data(opts \\ []) do
    output_dir = Keyword.get(opts, :output_dir, Path.join(base_dir(), "export"))
    tracker = Keyword.get(opts, :tracker)

    if tracker do
      export_tracker_data(tracker, Path.join(output_dir, sanitize_tracker(tracker)))
    else
      # Exportar todos los trackers
      trackers = list_trackers()

      counts =
        Enum.map(trackers, fn t ->
          {:ok, count} = export_tracker_data(t, Path.join(output_dir, sanitize_tracker(t)))
          {t, count}
        end)

      total = Enum.reduce(counts, 0, fn {_t, count}, acc -> acc + count end)
      Logger.info("📦 Exported #{total} examples total from #{length(trackers)} trackers")
      {:ok, total}
    end
  end

  defp export_tracker_data(tracker, output_dir) do
    File.mkdir_p!(output_dir)

    labels_file = Path.join(output_dir, "labels.txt")
    File.write!(labels_file, "")

    # Recolectar todos los archivos con solución
    sources = [
      list_success_for_tracker(tracker),
      list_classified_for_tracker(tracker, nil)
    ]

    count =
      sources
      |> List.flatten()
      |> Enum.with_index()
      |> Enum.map(fn {item, idx} ->
        # Nuevo nombre secuencial
        new_filename = "#{String.pad_leading(to_string(idx), 6, "0")}.jpg"
        dest_path = Path.join(output_dir, new_filename)

        # Copiar imagen
        File.cp!(item.path, dest_path)

        # Agregar a labels.txt
        File.write!(labels_file, "#{new_filename}\t#{item.solution}\n", [:append])

        idx
      end)
      |> length()

    Logger.info("📦 [#{tracker}] Exported #{count} examples to #{output_dir}")
    {:ok, count}
  end

  @doc """
  Estadísticas del dataset.
  """
  def stats(tracker \\ nil) do
    if tracker do
      stats_for_tracker(tracker)
    else
      %{
        total: %{
          success: length(list_success()),
          failed: length(list_failed()),
          classified: length(list_classified())
        },
        by_tracker: stats_by_tracker()
      }
    end
  end

  defp stats_for_tracker(tracker) do
    %{
      tracker: tracker,
      success: length(list_success_for_tracker(tracker)),
      failed: length(list_failed_for_tracker(tracker)),
      classified: length(list_classified_for_tracker(tracker, nil)),
      categories: category_distribution(tracker)
    }
  end

  @doc """
  Estadísticas por tracker.
  """
  def stats_by_tracker do
    list_trackers()
    |> Enum.map(fn tracker ->
      {tracker, stats_for_tracker(tracker)}
    end)
    |> Enum.into(%{})
  end

  @doc """
  Distribución por categoría.
  """
  def category_distribution(tracker \\ nil) do
    list_classified(tracker)
    |> Enum.group_by(& &1.category)
    |> Enum.map(fn {category, items} -> {category, length(items)} end)
    |> Enum.into(%{})
  end

  # Private functions

  defp base_dir do
    Application.get_env(:tailorr, :captcha_learning_dir, @default_base_dir)
  end

  defp generate_uuid do
    :crypto.strong_rand_bytes(8) |> Base.encode16(case: :lower)
  end

  defp sanitize_filename(str) do
    str
    |> String.replace(~r/[^\w\d\-]/, "_")
    # Limitar longitud
    |> String.slice(0, 50)
  end

  defp sanitize_tracker(tracker) do
    tracker
    |> String.replace(~r/[^\w\d\-\.]/, "_")
    |> String.downcase()
  end

  defp get_image_binary(%{image_type: :url, image: url}) do
    case Req.get(url) do
      {:ok, %{body: body}} -> body
      _ -> raise "Failed to download image from URL"
    end
  end

  defp get_image_binary(%{image_type: :base64, image: base64}) do
    clean = String.replace(base64, ~r/^data:image\/[^;]+;base64,/, "")
    Base.decode64!(clean)
  end

  defp save_metadata(image_path, metadata) do
    json_path = String.replace(image_path, ~r/\.jpg$/, ".json")
    json_content = Jason.encode!(metadata, pretty: true)
    File.write!(json_path, json_content)
  end

  defp load_metadata(image_path) do
    json_path = String.replace(image_path, ~r/\.jpg$/, ".json")

    with true <- File.exists?(json_path),
         {:ok, content} <- File.read(json_path),
         {:ok, data} <- Jason.decode(content, keys: :atoms) do
      data
    else
      _ -> %{}
    end
  end

  defp update_metadata(image_path, updates) do
    current = load_metadata(image_path)
    new_metadata = Map.merge(current, updates)
    save_metadata(image_path, new_metadata)
  end

  defp find_file(tracker, filename) when is_binary(tracker) and is_binary(filename) do
    tracker_base = Path.join(base_dir(), sanitize_tracker(tracker))

    search_paths = [
      Path.join([tracker_base, @dirs.failed, filename]),
      Path.join([tracker_base, @dirs.pending, filename]),
      Path.join([tracker_base, @dirs.success, filename])
    ]

    Enum.find(search_paths, &File.exists?/1)
  end

  defp extract_uuid(filename) do
    filename
    |> String.replace(~r/\.jpg$/, "")
    |> String.split("_")
    |> List.first()
  end

  defp parse_success_filename(filename) do
    base = String.replace(filename, ~r/\.jpg$/, "")

    case String.split(base, "_", parts: 2) do
      [uuid, solution] -> {uuid, solution}
      [uuid] -> {uuid, nil}
    end
  end

  defp file_mtime(path) do
    case File.stat(path) do
      {:ok, %{mtime: mtime}} ->
        mtime |> NaiveDateTime.from_erl!() |> DateTime.from_naive!("Etc/UTC")

      _ ->
        DateTime.utc_now()
    end
  end
end
