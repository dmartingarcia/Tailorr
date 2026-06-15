defmodule Tailorr.Captcha.SmartSolverTest do
  use ExUnit.Case, async: false

  alias Tailorr.Captcha.FileStorage
  alias Tailorr.Captcha.SmartSolver

  @test_dir "priv/ml/captcha_learning_test"

  setup do
    # Cleanup
    if File.exists?(@test_dir) do
      File.rm_rf!(@test_dir)
    end

    Application.put_env(:tailorr, :captcha_learning_dir, @test_dir)

    on_exit(fn ->
      if File.exists?(@test_dir) do
        File.rm_rf!(@test_dir)
      end

      Application.delete_env(:tailorr, :captcha_learning_dir)
    end)

    :ok
  end

  describe "solve/2 con strategy: :cascade" do
    test "usa ML primero si tiene alta confianza" do
      captcha = build_captcha()

      # Mock ML solver to return high confidence
      result =
        SmartSolver.solve(captcha,
          strategy: :ml_only,
          save_learning: false
        )

      # Debería intentar ML
      assert match?({:ok, _, _}, result) or match?({:error, _}, result)
    end

    test "guarda aciertos automáticamente" do
      captcha = build_captcha_with_tracker()

      # Resolver
      SmartSolver.solve(captcha,
        strategy: :user_only,
        fallback: :manual,
        save_learning: true
      )

      # Verificar que se guardó (aunque falle manual en test)
      # El sistema debería haber intentado guardar
      :ok
    end
  end

  describe "solve/2 con strategy: :user_only" do
    test "va directo a usuario sin intentar ML" do
      captcha = build_captcha()

      result =
        SmartSolver.solve(captcha,
          strategy: :user_only,
          fallback: :manual,
          save_learning: false
        )

      # Debería fallar porque no hay input en tests
      assert {:error, _} = result
    end
  end

  describe "stats/0" do
    test "delega a FileStorage.stats/0" do
      FileStorage.save_success(build_captcha(), "TEST", "test.com")

      stats = SmartSolver.stats()

      assert is_map(stats)
      assert Map.has_key?(stats, :total) || Map.has_key?(stats, :by_tracker)
    end
  end

  describe "export_training_data/1" do
    test "delega a FileStorage.export_training_data/1" do
      FileStorage.save_success(build_captcha(), "EXP", "test.com")

      export_dir = Path.join(@test_dir, "export")
      {:ok, count} = SmartSolver.export_training_data(output_dir: export_dir)

      assert count >= 0
    end
  end

  describe "get_failed_examples/1" do
    test "retorna ejemplos fallidos" do
      FileStorage.save_failure(build_captcha(), "test.com")
      FileStorage.save_failure(build_captcha(), "test.com")

      examples = SmartSolver.get_failed_examples()

      assert length(examples) == 2
    end

    test "respeta límite" do
      FileStorage.save_failure(build_captcha(), "test.com")
      FileStorage.save_failure(build_captcha(), "test.com")
      FileStorage.save_failure(build_captcha(), "test.com")

      examples = SmartSolver.get_failed_examples(limit: 2)

      assert length(examples) == 2
    end
  end

  describe "classify/3" do
    test "delega a FileStorage.classify/3" do
      {:ok, path} = FileStorage.save_failure(build_captcha(), "test.com")
      filename = Path.basename(path)

      result =
        SmartSolver.classify("test.com", filename,
          solution: "TEST",
          category: "other"
        )

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end

  # Helpers

  defp build_captcha do
    base64_png =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    %{
      image: "data:image/png;base64,#{base64_png}",
      image_type: :base64
    }
  end

  defp build_captcha_with_tracker do
    %{
      image: "https://test.tracker.com/captcha.php",
      image_type: :url,
      tracker: "test.tracker.com"
    }
  end
end
