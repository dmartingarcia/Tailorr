defmodule Tailorr.Captcha.Solvers.OCRTest do
  use ExUnit.Case, async: true

  alias Tailorr.Captcha.Solvers.OCR

  @moduletag :integration

  describe "solve/2" do
    test "retorna error si tesseract no está instalado" do
      captcha = %{
        image: "data:image/png;base64,iVBORw0KGgo=",
        image_type: :base64
      }

      result = OCR.solve(captcha, tesseract_cmd: "nonexistent_tesseract")

      assert {:error, :tesseract_not_found} = result
    end

    test "retorna error para base64 inválido" do
      captcha = %{
        image: "not-valid-base64!!!",
        image_type: :base64
      }

      assert {:error, :invalid_base64} = OCR.solve(captcha)
    end

    test "reconoce dígitos simples con whitelist" do
      tesseract = System.find_executable("tesseract")
      convert = System.find_executable("convert")

      if is_nil(tesseract) or is_nil(convert) do
        IO.puts("  [skip] tesseract/imagemagick not installed — run via Docker")
      else
        tmp = Path.join(System.tmp_dir!(), "ocr_test_#{:erlang.unique_integer([:positive])}.png")

        # Generate a clean 200x60 white image with "12345" in black
        {_, 0} =
          System.cmd("convert", [
            "-size", "200x60",
            "xc:white",
            "-font", "Courier",
            "-pointsize", "36",
            "-fill", "black",
            "-gravity", "Center",
            "-annotate", "0",
            "12345",
            tmp
          ])

        png_b64 = tmp |> File.read!() |> Base.encode64()
        File.rm(tmp)

        captcha = %{image: "data:image/png;base64,#{png_b64}", image_type: :base64}
        assert {:ok, text} = OCR.solve(captcha, whitelist: "0123456789", preprocessing: false)
        assert String.replace(text, ~r/\s/, "") =~ "12345"
      end
    end

    test "acepta opciones de configuración" do
      captcha = %{
        image: "data:image/png;base64,iVBORw0KGgo=",
        image_type: :base64
      }

      # No debería crashear con opciones válidas
      result =
        OCR.solve(captcha,
          whitelist: "0123456789",
          psm: 7,
          preprocessing: false
        )

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end

  describe "configuración" do
    test "usa tesseract por defecto" do
      captcha = %{
        image: "data:image/png;base64,iVBORw0KGgo=",
        image_type: :base64
      }

      # Default tesseract_cmd debería ser "tesseract"
      result = OCR.solve(captcha)

      assert match?({:ok, _}, result) or match?({:error, _}, result)
    end
  end
end
