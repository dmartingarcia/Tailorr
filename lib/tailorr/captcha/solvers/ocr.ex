defmodule Tailorr.Captcha.Solvers.OCR do
  @moduledoc """
  CAPTCHA solver using Tesseract OCR.

  Suitable for simple image-based CAPTCHAs (old-style PHP CAPTCHAs with
  distorted numbers/letters). Not suitable for modern CAPTCHAs like
  reCAPTCHA or hCaptcha.

  ## Requirements

  Tesseract must be installed on the system:

      # macOS
      brew install tesseract

      # Ubuntu/Debian
      apt-get install tesseract-ocr

      # Alpine (Docker)
      apk add tesseract-ocr

  ## Options
    - `:tesseract_cmd` - Path to tesseract binary (default: "tesseract")
    - `:psm` - Page segmentation mode (default: 7 = single line)
    - `:oem` - OCR Engine mode (default: 3 = LSTM + legacy)
    - `:whitelist` - Characters to recognize (e.g., "0123456789" for digits only)
    - `:preprocessing` - Image preprocessing (default: true)
    - `:lang` - Language data (default: "eng")

  ## Page Segmentation Modes (PSM)
    - 6: Assume a single uniform block of text
    - 7: Treat the image as a single text line (best for CAPTCHAs)
    - 8: Treat the image as a single word
    - 10: Treat the image as a single character

  ## Examples

      # Simple CAPTCHA with numbers only
      captcha = %{image: "https://site.com/captcha.php", image_type: :url}
      OCR.solve(captcha, whitelist: "0123456789", psm: 7)
      #=> {:ok, "492851"}

      # Alphanumeric CAPTCHA
      OCR.solve(captcha, whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
      #=> {:ok, "A8KQ7"}

      # Base64 encoded image
      captcha = %{image: "data:image/png;base64,...", image_type: :base64}
      OCR.solve(captcha)
      #=> {:ok, "XKCD"}
  """

  @behaviour Tailorr.Captcha.Solver

  require Logger

  @impl true
  def solve(captcha_data, opts \\ []) do
    with {:ok, image_path} <- prepare_image(captcha_data),
         {:ok, processed_path} <- maybe_preprocess(image_path, opts),
         {:ok, text} <- run_tesseract(processed_path, opts) do
      cleanup_temp_files([image_path, processed_path])
      {:ok, String.trim(text)}
    else
      {:error, _} = error ->
        error
    end
  end

  # Download or decode image to temporary file
  defp prepare_image(%{image_type: :url, image: url}) do
    if String.starts_with?(url, "http") do
      download_image(url)
    else
      {:error, {:invalid_url, url}}
    end
  end

  defp download_image(url) do
    temp_path = temp_file("captcha", ".png")

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
    temp_path = temp_file("captcha", ".png")

    # Remove data URI prefix if present
    clean_data =
      base64_data
      |> String.replace(~r/^data:image\/[^;]+;base64,/, "")

    case Base.decode64(clean_data) do
      {:ok, binary} ->
        File.write!(temp_path, binary)
        {:ok, temp_path}

      :error ->
        {:error, :invalid_base64}
    end
  end

  # Optional preprocessing to improve OCR accuracy
  defp maybe_preprocess(image_path, opts) do
    if Keyword.get(opts, :preprocessing, true) do
      preprocess_image(image_path)
    else
      {:ok, image_path}
    end
  end

  defp preprocess_image(image_path) do
    # Use ImageMagick to improve OCR accuracy:
    # - Convert to grayscale
    # - Increase contrast
    # - Remove noise
    # - Resize if too small
    output_path = temp_file("preprocessed", ".png")

    convert_cmd = """
    convert #{image_path} \
      -colorspace Gray \
      -normalize \
      -threshold 50% \
      -resize 200% \
      #{output_path}
    """

    case System.cmd("sh", ["-c", convert_cmd], stderr_to_stdout: true) do
      {_, 0} ->
        {:ok, output_path}

      {output, code} ->
        Logger.warning("ImageMagick preprocessing failed (code #{code}): #{output}")
        # Fall back to original image if preprocessing fails
        {:ok, image_path}
    end
  rescue
    e ->
      Logger.warning("ImageMagick preprocessing error: #{inspect(e)}")
      {:ok, image_path}
  end

  # Run Tesseract OCR on image
  defp run_tesseract(image_path, opts) do
    tesseract_cmd = Keyword.get(opts, :tesseract_cmd, "tesseract")
    psm = Keyword.get(opts, :psm, 7)
    oem = Keyword.get(opts, :oem, 3)
    lang = Keyword.get(opts, :lang, "eng")

    # Build Tesseract command
    args = [
      image_path,
      "stdout",
      "-l",
      lang,
      "--psm",
      to_string(psm),
      "--oem",
      to_string(oem)
    ]

    # Add character whitelist if specified
    args =
      if whitelist = Keyword.get(opts, :whitelist) do
        args ++ ["-c", "tessedit_char_whitelist=#{whitelist}"]
      else
        args
      end

    case System.cmd(tesseract_cmd, args, stderr_to_stdout: true) do
      {output, 0} ->
        # Clean up output (remove extra whitespace, newlines)
        cleaned =
          output
          |> String.trim()
          |> String.replace(~r/\s+/, "")

        if cleaned == "" do
          {:error, :no_text_found}
        else
          {:ok, cleaned}
        end

      {output, code} ->
        Logger.error("Tesseract failed (code #{code}): #{output}")
        {:error, {:tesseract_failed, code}}
    end
  rescue
    e in ErlangError ->
      if e.original == :enoent do
        {:error, :tesseract_not_found}
      else
        {:error, {:tesseract_error, e}}
      end
  end

  # Generate temporary file path
  defp temp_file(prefix, suffix) do
    random = :crypto.strong_rand_bytes(8) |> Base.encode16(case: :lower)
    Path.join(System.tmp_dir!(), "#{prefix}_#{random}#{suffix}")
  end

  # Clean up temporary files
  defp cleanup_temp_files(paths) do
    Enum.each(paths, fn path ->
      if path && File.exists?(path) do
        File.rm(path)
      end
    end)
  end
end
