defmodule Tailorr.Captcha.FileStorageTest do
  use ExUnit.Case, async: false

  alias Tailorr.Captcha.FileStorage

  @test_dir "priv/ml/captcha_learning_test"
  @test_tracker "test.tracker.com"

  setup do
    # Cleanup antes de cada test
    if File.exists?(@test_dir) do
      File.rm_rf!(@test_dir)
    end

    # Sobrescribir directorio base para tests
    Application.put_env(:tailorr, :captcha_learning_dir, @test_dir)

    on_exit(fn ->
      if File.exists?(@test_dir) do
        File.rm_rf!(@test_dir)
      end

      Application.delete_env(:tailorr, :captcha_learning_dir)
    end)

    :ok
  end

  describe "init/1" do
    test "crea estructura de directorios para un tracker" do
      # Temporalmente modificar el módulo para usar test_dir
      FileStorage.init(@test_tracker)

      # Verificar que existen los directorios
      assert File.dir?(Path.join([@test_dir, "test.tracker.com", "success"]))
      assert File.dir?(Path.join([@test_dir, "test.tracker.com", "failed"]))
      assert File.dir?(Path.join([@test_dir, "test.tracker.com", "pending"]))
      assert File.dir?(Path.join([@test_dir, "test.tracker.com", "classified"]))
    end
  end

  describe "save_success/4" do
    test "guarda CAPTCHA exitoso con solución en el nombre" do
      captcha = build_captcha_data()
      solution = "ABC123"

      {:ok, filepath} = FileStorage.save_success(captcha, solution, @test_tracker)

      # Verificar que el archivo existe
      assert File.exists?(filepath)

      # Verificar que el nombre contiene la solución
      assert filepath =~ solution

      # Verificar que está en el directorio correcto
      assert filepath =~ "test.tracker.com/success"
    end

    test "guarda metadata junto a la imagen" do
      captcha = build_captcha_data()
      metadata = %{solver: "ml", confidence: 0.95}

      {:ok, filepath} = FileStorage.save_success(captcha, "TEST", @test_tracker, metadata)

      # Verificar metadata file
      json_path = String.replace(filepath, ".jpg", ".json")
      assert File.exists?(json_path)

      {:ok, content} = File.read(json_path)
      {:ok, saved_metadata} = Jason.decode(content, keys: :atoms)

      assert saved_metadata.solver == "ml"
      assert saved_metadata.confidence == 0.95
      assert saved_metadata.tracker == @test_tracker
    end
  end

  describe "save_failure/3" do
    test "guarda CAPTCHA fallido sin solución en el nombre" do
      captcha = build_captcha_data()

      {:ok, filepath} = FileStorage.save_failure(captcha, @test_tracker)

      # Verificar que existe
      assert File.exists?(filepath)

      # Verificar que NO contiene guión bajo (sin solución)
      filename = Path.basename(filepath)
      refute filename =~ "_"

      # Verificar directorio
      assert filepath =~ "test.tracker.com/failed"
    end

    test "guarda metadata con status failed" do
      captcha = build_captcha_data()
      metadata = %{ml_prediction: "WRONG"}

      {:ok, filepath} = FileStorage.save_failure(captcha, @test_tracker, metadata)

      json_path = String.replace(filepath, ".jpg", ".json")
      {:ok, content} = File.read(json_path)
      {:ok, saved_metadata} = Jason.decode(content, keys: :atoms)

      assert saved_metadata.status == "failed"
      assert saved_metadata.ml_prediction == "WRONG"
    end
  end

  describe "classify/3" do
    test "mueve archivo de failed a classified con solución" do
      captcha = build_captcha_data()
      {:ok, failed_path} = FileStorage.save_failure(captcha, @test_tracker)

      filename = Path.basename(failed_path)
      solution = "CORRECT"
      category = "distorted"

      {:ok, classified_path} =
        FileStorage.classify(@test_tracker, filename,
          solution: solution,
          category: category,
          notes: "Test note"
        )

      # Verificar que el archivo original ya no existe
      refute File.exists?(failed_path)

      # Verificar que existe en classified
      assert File.exists?(classified_path)
      assert classified_path =~ "classified/#{category}"
      assert classified_path =~ solution
    end

    test "retorna error si archivo no existe" do
      result =
        FileStorage.classify(@test_tracker, "nonexistent.jpg",
          solution: "TEST",
          category: "other"
        )

      assert {:error, :file_not_found} = result
    end
  end

  describe "list_failed/1" do
    test "lista archivos fallidos de un tracker" do
      captcha1 = build_captcha_data()
      captcha2 = build_captcha_data()

      FileStorage.save_failure(captcha1, @test_tracker)
      FileStorage.save_failure(captcha2, @test_tracker)

      failed = FileStorage.list_failed(@test_tracker)

      assert length(failed) == 2
      assert Enum.all?(failed, &(&1.tracker == @test_tracker))
    end

    test "lista de todos los trackers cuando no se especifica" do
      FileStorage.save_failure(build_captcha_data(), "tracker1.com")
      FileStorage.save_failure(build_captcha_data(), "tracker2.com")

      all_failed = FileStorage.list_failed()

      assert length(all_failed) == 2
      assert Enum.any?(all_failed, &(&1.tracker == "tracker1.com"))
      assert Enum.any?(all_failed, &(&1.tracker == "tracker2.com"))
    end
  end

  describe "list_success/1" do
    test "lista archivos exitosos con solución parseada" do
      captcha = build_captcha_data()
      FileStorage.save_success(captcha, "ABC123", @test_tracker)

      success = FileStorage.list_success(@test_tracker)

      assert length(success) == 1
      assert hd(success).solution == "ABC123"
      assert hd(success).tracker == @test_tracker
    end
  end

  describe "list_trackers/0" do
    test "lista todos los trackers con datos" do
      FileStorage.save_success(build_captcha_data(), "TEST", "tracker1.com")
      FileStorage.save_success(build_captcha_data(), "TEST", "tracker2.com")

      trackers = FileStorage.list_trackers()

      assert "tracker1.com" in trackers
      assert "tracker2.com" in trackers
    end
  end

  describe "export_training_data/1" do
    test "exporta datos de un tracker específico" do
      # Guardar algunos ejemplos
      FileStorage.save_success(build_captcha_data(), "ABC", @test_tracker)
      FileStorage.save_success(build_captcha_data(), "XYZ", @test_tracker)

      export_dir = Path.join(@test_dir, "export_test")

      {:ok, count} =
        FileStorage.export_training_data(
          output_dir: export_dir,
          tracker: @test_tracker
        )

      assert count == 2

      # Verificar labels.txt
      labels_file = Path.join([export_dir, "test.tracker.com", "labels.txt"])
      assert File.exists?(labels_file)

      {:ok, content} = File.read(labels_file)
      assert content =~ "ABC"
      assert content =~ "XYZ"
    end

    test "exporta todos los trackers" do
      FileStorage.save_success(build_captcha_data(), "T1", "tracker1.com")
      FileStorage.save_success(build_captcha_data(), "T2", "tracker2.com")

      export_dir = Path.join(@test_dir, "export_all")

      {:ok, total} = FileStorage.export_training_data(output_dir: export_dir)

      assert total == 2
      assert File.exists?(Path.join([export_dir, "tracker1.com", "labels.txt"]))
      assert File.exists?(Path.join([export_dir, "tracker2.com", "labels.txt"]))
    end
  end

  describe "stats/1" do
    test "retorna estadísticas de un tracker" do
      FileStorage.save_success(build_captcha_data(), "S1", @test_tracker)
      FileStorage.save_success(build_captcha_data(), "S2", @test_tracker)
      FileStorage.save_failure(build_captcha_data(), @test_tracker)

      stats = FileStorage.stats(@test_tracker)

      assert stats.tracker == @test_tracker
      assert stats.success == 2
      assert stats.failed == 1
    end

    test "retorna estadísticas globales" do
      FileStorage.save_success(build_captcha_data(), "S1", "tracker1.com")
      FileStorage.save_failure(build_captcha_data(), "tracker2.com")

      stats = FileStorage.stats()

      assert stats.total.success == 1
      assert stats.total.failed == 1
      assert is_map(stats.by_tracker)
    end
  end

  describe "stats_by_tracker/0" do
    test "agrupa estadísticas por tracker" do
      FileStorage.save_success(build_captcha_data(), "T1", "tracker1.com")
      FileStorage.save_success(build_captcha_data(), "T1", "tracker1.com")
      FileStorage.save_failure(build_captcha_data(), "tracker2.com")

      stats = FileStorage.stats_by_tracker()

      assert stats["tracker1.com"].success == 2
      assert stats["tracker2.com"].failed == 1
    end
  end

  # Helper functions

  defp build_captcha_data do
    # Imagen PNG válida de 1x1 pixel transparente
    base64_png =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    %{
      image: "data:image/png;base64,#{base64_png}",
      image_type: :base64
    }
  end
end
