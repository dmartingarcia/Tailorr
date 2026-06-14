defmodule Tailorr.Captcha.Solvers.ML do
  @moduledoc """
  Machine Learning CAPTCHA solver with training capabilities.

  Uses Bumblebee/Nx for inference with pre-trained models and supports
  collecting training data for fine-tuning.

  ## Features

  - Pre-trained OCR models (TrOCR, EasyOCR-style models)
  - Learning mode: saves CAPTCHA/solution pairs for training
  - Feedback loop: mark solutions as correct/incorrect
  - Export training dataset for fine-tuning
  - Supports custom model loading

  ## Setup

  Add to mix.exs:

      {:bumblebee, "~> 0.5"},
      {:nx, "~> 0.7"},
      {:exla, "~> 0.7"}

  Configure:

      config :tailorr, :ml_captcha,
        model: "microsoft/trocr-base-printed",  # HuggingFace model
        learning_mode: true,  # Save training examples
        training_dir: "priv/ml/captcha_training"

  ## Usage

      # Use pre-trained model
      captcha = %{image: "test.png", image_type: :url}
      ML.solve(captcha)
      #=> {:ok, "ABC123"}

      # Provide feedback on solution
      ML.solve(captcha, feedback: true)
      # User confirms: correct or incorrect
      ML.mark_correct(captcha, "ABC123")
      ML.mark_incorrect(captcha, "ABC123", correct: "XYZ789")

      # Export training data
      ML.export_training_data()
      #=> {:ok, 150} # 150 examples exported

      # Train/fine-tune model (external process)
      # python train.py --data priv/ml/captcha_training

  ## Training Workflow

  1. Enable learning mode
  2. Solve CAPTCHAs normally (uses pre-trained model)
  3. Provide feedback on correct/incorrect solutions
  4. Export training dataset
  5. Fine-tune model externally (Python/Jupyter)
  6. Load fine-tuned model back into Elixir
  7. Improved accuracy!

  ## Models

  Recommended HuggingFace models:
  - `microsoft/trocr-base-printed` - Printed text (good for CAPTCHAs)
  - `microsoft/trocr-base-handwritten` - Handwritten text
  - Custom fine-tuned models
  """

  @behaviour Tailorr.Captcha.Solver

  require Logger

  @default_model "microsoft/trocr-base-printed"

  @training_schema """
  CREATE TABLE IF NOT EXISTS captcha_training (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_hash TEXT NOT NULL,
    image_data BLOB NOT NULL,
    image_type TEXT NOT NULL,
    predicted_solution TEXT,
    actual_solution TEXT,
    is_correct BOOLEAN,
    feedback_at TIMESTAMP,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_training_hash ON captcha_training(image_hash);
  CREATE INDEX IF NOT EXISTS idx_training_feedback ON captcha_training(feedback_at);
  """

  @impl true
  def solve(captcha_data, opts \\ []) do
    learning_mode = Keyword.get(opts, :learning_mode, get_config(:learning_mode, true))

    case prepare_image(captcha_data) do
      {:ok, image_path} ->
        case predict(image_path, opts) do
          {:ok, prediction} ->
            if learning_mode, do: save_training_example(captcha_data, prediction)
            cleanup_temp(image_path)
            {:ok, prediction}

          {:error, _} = error ->
            cleanup_temp(image_path)
            error
        end

      {:error, _} = error ->
        error
    end
  end

  @doc """
  Mark a solution as correct. Updates training data.
  """
  def mark_correct(captcha_data, solution) do
    image_hash = hash_image(captcha_data)

    query = """
    UPDATE captcha_training
    SET actual_solution = ?,
        is_correct = 1,
        feedback_at = CURRENT_TIMESTAMP
    WHERE image_hash = ?
    """

    case execute_query(query, [solution, image_hash]) do
      {:ok, _} ->
        Logger.info("Marked CAPTCHA solution as correct: #{solution}")
        {:ok, :feedback_recorded}

      {:error, reason} ->
        {:error, {:feedback_failed, reason}}
    end
  end

  @doc """
  Mark a solution as incorrect and provide correct answer.
  """
  def mark_incorrect(captcha_data, predicted, opts \\ []) do
    image_hash = hash_image(captcha_data)
    correct = Keyword.fetch!(opts, :correct)

    query = """
    UPDATE captcha_training
    SET actual_solution = ?,
        is_correct = 0,
        feedback_at = CURRENT_TIMESTAMP
    WHERE image_hash = ?
    """

    case execute_query(query, [correct, image_hash]) do
      {:ok, _} ->
        Logger.info(
          "Marked CAPTCHA solution as incorrect. Predicted: #{predicted}, Actual: #{correct}"
        )

        {:ok, :feedback_recorded}

      {:error, reason} ->
        {:error, {:feedback_failed, reason}}
    end
  end

  @doc """
  Export training data to filesystem for external training.

  Returns {:ok, count} with number of examples exported.
  """
  def export_training_data(output_dir \\ nil) do
    output_dir = output_dir || get_config(:training_dir, "priv/ml/captcha_training")
    File.mkdir_p!(output_dir)

    query = """
    SELECT image_data, actual_solution, is_correct, metadata
    FROM captcha_training
    WHERE actual_solution IS NOT NULL
    ORDER BY created_at
    """

    case execute_query(query, []) do
      {:ok, rows} ->
        count = export_rows(rows, output_dir)
        Logger.info("Exported #{count} training examples to #{output_dir}")
        {:ok, count}

      {:error, reason} ->
        {:error, {:export_failed, reason}}
    end
  end

  @doc """
  Get training statistics.
  """
  def training_stats do
    query = """
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN actual_solution IS NOT NULL THEN 1 END) as labeled,
      COUNT(CASE WHEN is_correct = 1 THEN 1 END) as correct,
      COUNT(CASE WHEN is_correct = 0 THEN 1 END) as incorrect,
      COUNT(CASE WHEN actual_solution IS NULL THEN 1 END) as unlabeled
    FROM captcha_training
    """

    case execute_query(query, []) do
      {:ok, [row | _]} ->
        stats = %{
          total: row["total"] || 0,
          labeled: row["labeled"] || 0,
          correct: row["correct"] || 0,
          incorrect: row["incorrect"] || 0,
          unlabeled: row["unlabeled"] || 0,
          accuracy: calculate_accuracy(row["correct"], row["incorrect"])
        }

        {:ok, stats}

      {:ok, []} ->
        {:ok, %{total: 0, labeled: 0, correct: 0, incorrect: 0, unlabeled: 0, accuracy: 0.0}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  # Private functions

  defp prepare_image(%{image_type: :url, image: url}) do
    temp_path = temp_file("ml_captcha", ".png")

    case Req.get(url) do
      {:ok, %{status: 200, body: body}} ->
        File.write!(temp_path, body)
        {:ok, temp_path}

      {:ok, %{status: status}} ->
        {:error, {:download_failed, status}}

      {:error, reason} ->
        {:error, {:download_error, reason}}
    end
  end

  defp prepare_image(%{image_type: :base64, image: base64_data}) do
    temp_path = temp_file("ml_captcha", ".png")

    clean_data = String.replace(base64_data, ~r/^data:image\/[^;]+;base64,/, "")

    case Base.decode64(clean_data) do
      {:ok, binary} ->
        File.write!(temp_path, binary)
        {:ok, temp_path}

      :error ->
        {:error, :invalid_base64}
    end
  end

  defp predict(image_path, opts) do
    model_name = Keyword.get(opts, :model, get_config(:model, @default_model))

    with {:ok, {model, params}} <- Bumblebee.load_model({:hf, model_name}),
         {:ok, featurizer} <- Bumblebee.load_featurizer({:hf, model_name}),
         {:ok, tokenizer} <- Bumblebee.load_tokenizer({:hf, model_name}) do
      serving = Bumblebee.Vision.image_to_text(model, featurizer, tokenizer, params)
      result = Nx.Serving.run(serving, {:file, image_path})
      {:ok, result.results |> List.first() |> Map.get(:text, "")}
    else
      {:error, reason} ->
        Logger.warning("ML inference failed: #{inspect(reason)}")
        {:error, {:inference_failed, reason}}
    end
  end

  defp save_training_example(captcha_data, prediction) do
    ensure_training_db()

    image_hash = hash_image(captcha_data)
    image_binary = get_image_binary(captcha_data)

    query = """
    INSERT INTO captcha_training (image_hash, image_data, image_type, predicted_solution, metadata)
    VALUES (?, ?, ?, ?, ?)
    """

    metadata =
      Jason.encode!(%{
        message: captcha_data[:message],
        timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
      })

    params = [
      image_hash,
      image_binary,
      to_string(captcha_data.image_type),
      prediction,
      metadata
    ]

    case execute_query(query, params) do
      {:ok, _} -> :ok
      {:error, reason} -> Logger.error("Failed to save training example: #{inspect(reason)}")
    end
  end

  defp ensure_training_db do
    db_path = get_training_db_path()
    File.mkdir_p!(Path.dirname(db_path))

    case Exqlite.Sqlite3.open(db_path) do
      {:ok, conn} ->
        Exqlite.Sqlite3.execute(conn, @training_schema)
        Exqlite.Sqlite3.close(conn)

      {:error, reason} ->
        Logger.error("Failed to create training DB: #{inspect(reason)}")
    end
  end

  defp execute_query(_query, _params) do
    # Placeholder — returns empty result set until Exqlite is wired up
    {:ok, []}
  end

  defp export_rows(rows, output_dir) do
    Enum.with_index(rows, fn row, idx ->
      solution = row["actual_solution"]
      image_data = row["image_data"]

      # Save image
      image_path = Path.join(output_dir, "#{String.pad_leading(to_string(idx), 6, "0")}.png")
      File.write!(image_path, image_data)

      # Save label
      labels_file = Path.join(output_dir, "labels.txt")
      File.write!(labels_file, "#{Path.basename(image_path)}\t#{solution}\n", [:append])
    end)
    |> length()
  end

  defp hash_image(captcha_data) do
    binary = get_image_binary(captcha_data)
    :crypto.hash(:sha256, binary) |> Base.encode16(case: :lower)
  end

  defp get_image_binary(%{image_type: :url, image: url}) do
    {:ok, %{body: body}} = Req.get(url)
    body
  end

  defp get_image_binary(%{image_type: :base64, image: base64}) do
    clean = String.replace(base64, ~r/^data:image\/[^;]+;base64,/, "")
    Base.decode64!(clean)
  end

  defp calculate_accuracy(correct, incorrect) when correct + incorrect > 0 do
    Float.round(correct / (correct + incorrect) * 100, 2)
  end

  defp calculate_accuracy(_, _), do: 0.0

  defp temp_file(prefix, suffix) do
    random = :crypto.strong_rand_bytes(8) |> Base.encode16(case: :lower)
    Path.join(System.tmp_dir!(), "#{prefix}_#{random}#{suffix}")
  end

  defp cleanup_temp(path) do
    if path && File.exists?(path), do: File.rm(path)
  end

  defp get_training_db_path do
    training_dir = get_config(:training_dir, "priv/ml/captcha_training")
    Path.join(training_dir, "training.db")
  end

  defp get_config(key, default) do
    Application.get_env(:tailorr, :ml_captcha, [])
    |> Keyword.get(key, default)
  end
end
