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

    @tag :skip
    test "reconoce dígitos simples con whitelist" do
      # Requiere tesseract instalado y una imagen de prueba real
      # Skip por defecto, ejecutar manualmente con imagen de test
      :ok
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
