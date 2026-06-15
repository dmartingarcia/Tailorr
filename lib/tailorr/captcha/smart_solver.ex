defmodule Tailorr.Captcha.SmartSolver do
  @moduledoc """
  Solver inteligente con aprendizaje activo automático.

  ## Estrategia de Cascada

  1. **Intenta ML primero** (rápido, 50-95% accuracy)
     - Si confianza > 90% → usar
     - Si confianza 70-90% → verificar con usuario
     - Si confianza < 70% → pasar a siguiente

  2. **Si ML falla → Usuario** (Telegram/Manual)
     - Guarda respuesta como ejemplo de alta calidad
     - Feedback para entrenar ML

  3. **Aprende de todo**
     - Aciertos → Refuerzo positivo
     - Fallos → Ejemplos para mejorar
     - Usuario → Ground truth de alta calidad

  ## Uso

      # Automático: intenta ML, si falla pregunta a usuario
      SmartSolver.solve(captcha)

      # Con opciones
      SmartSolver.solve(captcha,
        strategy: :cascade,  # :cascade, :ml_only, :user_only
        confidence_threshold: 0.9,
        fallback: :telegram
      )
  """

  require Logger
  alias Tailorr.Captcha
  alias Tailorr.Captcha.FileStorage

  @doc """
  Resuelve CAPTCHA con estrategia inteligente.

  ## Opciones
    - `:strategy` - :cascade (default), :ml_only, :user_only
    - `:confidence_threshold` - Confianza mínima para aceptar ML (default: 0.9)
    - `:fallback` - Backend de usuario si ML falla (:telegram, :manual)
    - `:save_learning` - Guardar en DB de aprendizaje (default: true)
  """
  def solve(captcha_data, opts \\ []) do
    strategy = Keyword.get(opts, :strategy, :cascade)
    save_learning = Keyword.get(opts, :save_learning, true)

    start_time = System.monotonic_time(:millisecond)

    result =
      case strategy do
        :cascade -> solve_cascade(captcha_data, opts)
        :ml_only -> solve_ml_only(captcha_data, opts)
        :user_only -> solve_user_only(captcha_data, opts)
      end

    elapsed = System.monotonic_time(:millisecond) - start_time

    # Guardar en learning database
    if save_learning do
      save_result(captcha_data, result, elapsed)
    end

    result
  end

  @doc """
  Obtiene estadísticas de aprendizaje.
  """
  defdelegate stats, to: FileStorage

  @doc """
  Exporta datos de entrenamiento.
  """
  defdelegate export_training_data(opts \\ []), to: FileStorage

  @doc """
  Obtiene ejemplos que necesitan revisión.
  """
  def get_failed_examples(opts \\ []) do
    FileStorage.list_failed()
    |> maybe_limit(Keyword.get(opts, :limit))
  end

  @doc """
  Clasifica un ejemplo fallido.
  """
  defdelegate classify(tracker, filename, opts), to: FileStorage

  defp maybe_limit(list, nil), do: list
  defp maybe_limit(list, limit), do: Enum.take(list, limit)

  # Private functions

  # Estrategia en cascada: ML primero, usuario si falla
  defp solve_cascade(captcha_data, opts) do
    confidence_threshold = Keyword.get(opts, :confidence_threshold, 0.9)
    fallback = Keyword.get(opts, :fallback, :telegram)

    Logger.info("Trying ML solver...")

    case Captcha.solve(captcha_data, :ml) do
      {:ok, prediction, metadata} ->
        handle_ml_with_metadata(
          captcha_data,
          prediction,
          metadata,
          confidence_threshold,
          fallback
        )

      {:ok, prediction} ->
        handle_ml_without_metadata(captcha_data, prediction, fallback)

      {:error, reason} ->
        handle_ml_failure(captcha_data, reason, fallback)
    end
  end

  defp handle_ml_with_metadata(captcha_data, prediction, metadata, confidence_threshold, fallback) do
    confidence = Map.get(metadata, :confidence, 0.0)

    if confidence >= confidence_threshold do
      Logger.info("ML confident (#{Float.round(confidence * 100, 1)}%): #{prediction}")
      {:ok, prediction, Map.merge(metadata, %{solver: :ml, confidence: confidence})}
    else
      Logger.info("ML uncertain (#{Float.round(confidence * 100, 1)}%), asking user...")
      ask_user_after_uncertain_ml(captcha_data, prediction, confidence, metadata, fallback)
    end
  end

  defp ask_user_after_uncertain_ml(captcha_data, prediction, confidence, metadata, fallback) do
    case solve_with_user(captcha_data, fallback) do
      {:ok, user_solution} ->
        success = prediction == user_solution
        log_ml_vs_user(success, user_solution, prediction)

        {:ok, user_solution,
         %{
           solver: fallback,
           ml_prediction: prediction,
           ml_confidence: confidence,
           verified_by_user: true,
           ml_was_correct: success
         }}

      {:error, _} ->
        Logger.warning("User failed, falling back to ML prediction")
        {:ok, prediction, Map.merge(metadata, %{solver: :ml, fallback: true})}
    end
  end

  defp log_ml_vs_user(true, _user_solution, _prediction) do
    Logger.info("ML was correct! (but low confidence)")
  end

  defp log_ml_vs_user(false, user_solution, prediction) do
    Logger.info("ML was wrong. User: #{user_solution}, ML: #{prediction}")
  end

  defp handle_ml_without_metadata(captcha_data, prediction, fallback) do
    Logger.info("ML returned prediction without confidence, asking user...")

    case solve_with_user(captcha_data, fallback) do
      {:ok, user_solution} ->
        {:ok, user_solution,
         %{solver: fallback, ml_prediction: prediction, verified_by_user: true}}

      {:error, _} ->
        {:ok, prediction, %{solver: :ml, fallback: true}}
    end
  end

  defp handle_ml_failure(captcha_data, reason, fallback) do
    Logger.warning("ML failed: #{inspect(reason)}, asking user...")

    case solve_with_user(captcha_data, fallback) do
      {:ok, solution} -> {:ok, solution, %{solver: fallback, ml_failed: true}}
      {:error, _} = error -> error
    end
  end

  # Solo ML, sin fallback
  defp solve_ml_only(captcha_data, _opts) do
    case Captcha.solve(captcha_data, :ml) do
      {:ok, prediction, metadata} ->
        {:ok, prediction, Map.merge(metadata, %{solver: :ml})}

      {:ok, prediction} ->
        {:ok, prediction, %{solver: :ml}}

      {:error, _} = error ->
        error
    end
  end

  # Solo usuario, sin ML
  defp solve_user_only(captcha_data, opts) do
    backend = Keyword.get(opts, :fallback, :telegram)

    case solve_with_user(captcha_data, backend) do
      {:ok, solution} ->
        {:ok, solution, %{solver: backend, high_quality: true}}

      {:error, _} = error ->
        error
    end
  end

  # Resuelve con usuario (Telegram o Manual)
  defp solve_with_user(captcha_data, :telegram) do
    case Captcha.solve(captcha_data, :telegram) do
      {:ok, solution} -> {:ok, solution}
      {:error, _} = error -> error
    end
  end

  defp solve_with_user(captcha_data, :manual) do
    case Captcha.solve(captcha_data, :manual) do
      {:ok, solution} -> {:ok, solution}
      {:error, _} = error -> error
    end
  end

  # Guarda resultado usando FileStorage
  defp save_result(captcha_data, result, elapsed_ms) do
    tracker = get_tracker(captcha_data)
    do_save_result(captcha_data, tracker, result, elapsed_ms)
  end

  defp do_save_result(captcha_data, tracker, {:ok, solution, metadata}, elapsed_ms) do
    file_metadata = build_file_metadata(metadata, elapsed_ms)
    persist_by_outcome(captcha_data, tracker, solution, file_metadata, metadata)
  end

  defp do_save_result(captcha_data, tracker, {:ok, solution}, elapsed_ms) do
    FileStorage.save_success(captcha_data, solution, tracker, %{
      solver: :ml,
      response_time_ms: elapsed_ms
    })
  end

  defp do_save_result(captcha_data, tracker, {:error, _reason}, elapsed_ms) do
    FileStorage.save_failure(captcha_data, tracker, %{
      error: true,
      response_time_ms: elapsed_ms
    })
  end

  defp build_file_metadata(metadata, elapsed_ms) do
    %{
      solver: Map.get(metadata, :solver, :unknown),
      ml_prediction: Map.get(metadata, :ml_prediction),
      ml_confidence: Map.get(metadata, :ml_confidence),
      verified_by_user: Map.get(metadata, :verified_by_user, false),
      response_time_ms: elapsed_ms,
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
    }
  end

  defp persist_by_outcome(captcha_data, tracker, solution, file_metadata, metadata) do
    solver = file_metadata.solver
    ml_was_correct = Map.get(metadata, :ml_was_correct)
    ml_confidence = file_metadata.ml_confidence

    cond do
      ml_was_correct == true ->
        FileStorage.save_success(captcha_data, solution, tracker, file_metadata)

      ml_was_correct == false ->
        FileStorage.save_failure(captcha_data, tracker, Map.put(file_metadata, :ml_failed, true))

        FileStorage.save_success(
          captcha_data,
          solution,
          tracker,
          Map.put(file_metadata, :source, :user)
        )

      solver in [:telegram, :manual] ->
        FileStorage.save_success(
          captcha_data,
          solution,
          tracker,
          Map.put(file_metadata, :high_quality, true)
        )

      solver == :ml and is_number(ml_confidence) and ml_confidence >= 0.9 ->
        FileStorage.save_success(captcha_data, solution, tracker, file_metadata)

      solver == :ml ->
        FileStorage.save_pending(
          captcha_data,
          tracker,
          Map.put(file_metadata, :needs_verification, true)
        )

      true ->
        :ok
    end
  end

  # Obtiene el tracker/dominio del captcha
  defp get_tracker(captcha_data) do
    cond do
      # Si viene en metadata
      Map.has_key?(captcha_data, :tracker) ->
        captcha_data.tracker

      # Si viene en la URL de la imagen
      Map.get(captcha_data, :image_type) == :url ->
        extract_domain(captcha_data.image)

      # Default
      true ->
        "unknown"
    end
  end

  defp extract_domain(url) when is_binary(url) do
    case URI.parse(url) do
      %URI{host: host} when is_binary(host) -> host
      _ -> "unknown"
    end
  end

  defp extract_domain(_), do: "unknown"
end
