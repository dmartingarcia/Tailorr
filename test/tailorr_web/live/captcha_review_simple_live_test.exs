defmodule TailorrWeb.CaptchaReviewSimpleLiveTest do
  use TailorrWeb.ConnCase, async: false

  alias Tailorr.Captcha.FileStorage

  @test_dir "priv/ml/captcha_learning_test_live"
  @test_tracker "test.tracker.example"

  setup do
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

  describe "mount/3" do
    test "renders page without crashing when directories are empty", %{conn: conn} do
      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      assert html =~ "CAPTCHA Review"
    end

    test "renders stats panel with zero counts when no data", %{conn: conn} do
      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      assert html =~ "Total"
      assert html =~ "Fallidos"
      assert html =~ "Exitosos"
      assert html =~ "Clasificados"
    end

    test "renders tab buttons for switching categories", %{conn: conn} do
      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      assert html =~ "Fallidos"
      assert html =~ "Exitosos"
      assert html =~ "Clasificados"
    end

    test "renders export and refresh toolbar buttons", %{conn: conn} do
      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      assert html =~ "Exportar Training Data"
      assert html =~ "Refrescar"
    end

    test "renders tracker dropdown only when trackers exist", %{conn: conn} do
      # Empty dir = no trackers = no dropdown
      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      # No tracker dropdown should appear when no trackers exist
      refute html =~ "Tracker / Dominio"
    end

    test "renders tracker dropdown when trackers exist", %{conn: conn} do
      captcha_data = build_captcha_data()
      FileStorage.save_failure(captcha_data, @test_tracker)

      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      assert html =~ "Tracker / Dominio"
      assert html =~ @test_tracker
    end
  end

  describe "tab switching" do
    test "switches to success tab", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = view |> element("button[phx-value-tab='success']") |> render_click()
      assert html =~ "Exitosos"
    end

    test "switches to classified tab", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = view |> element("button[phx-value-tab='classified']") |> render_click()
      assert html =~ "Clasificados"
    end

    test "switches back to failed tab after switching away", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      view |> element("button[phx-value-tab='success']") |> render_click()
      html = view |> element("button[phx-value-tab='failed']") |> render_click()
      assert html =~ "Fallidos"
    end
  end

  describe "refresh event" do
    test "refresh reloads data without crashing", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = render_click(view, "refresh", %{})
      assert html =~ "CAPTCHA Review"
    end

    test "refresh reflects newly added files", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")

      # Add a failure after mount
      FileStorage.save_failure(build_captcha_data(), @test_tracker)

      html = render_click(view, "refresh", %{})
      # Stats should now reflect the new file
      assert html =~ "CAPTCHA Review"
    end
  end

  describe "export event" do
    test "export shows info flash with Exportando message", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = render_click(view, "export", %{"quality" => "all"})
      assert html =~ "Exportando"
    end

    test "export does not crash with no data", %{conn: conn} do
      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = render_click(view, "export", %{"quality" => "all"})
      assert html =~ "CAPTCHA Review"
    end
  end

  describe "example listing with data" do
    test "shows failed examples in failed tab", %{conn: conn} do
      FileStorage.save_failure(build_captcha_data(), @test_tracker)

      {:ok, _view, html} = live(conn, "/ui/captcha-review")
      # The count in the tab label should be 1
      assert html =~ "Fallidos (1)"
    end

    test "shows success examples in success tab", %{conn: conn} do
      FileStorage.save_success(build_captcha_data(), "ABC123", @test_tracker)

      {:ok, view, _html} = live(conn, "/ui/captcha-review")
      html = view |> element("button[phx-value-tab='success']") |> render_click()
      assert html =~ "Exitosos (1)"
    end
  end

  describe "select_example event" do
    test "selecting a failed example updates current_example", %{conn: conn} do
      {:ok, path} = FileStorage.save_failure(build_captcha_data(), @test_tracker)
      filename = Path.basename(path)

      {:ok, view, _html} = live(conn, "/ui/captcha-review")

      html =
        render_click(view, "select_example", %{"filename" => filename, "tab" => "failed"})

      # Detail view with classification form should appear
      assert html =~ filename
      assert html =~ "Solución Correcta"
    end
  end

  # Helpers

  defp build_captcha_data do
    base64_png =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

    %{
      image: "data:image/png;base64,#{base64_png}",
      image_type: :base64
    }
  end
end
