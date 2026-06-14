defmodule Tailorr.Scraper do
  @moduledoc """
  HTML parsing and result extraction using Floki.

  Reads CSS selectors from tracker config and extracts result data.
  Handles:
  - Multiple selector fallbacks (first match wins)
  - Attribute extraction (e.g., "a@href" gets href attribute)
  - Text normalization (trim, decode entities)
  - Size/date parsing and normalization
  """

  alias Tailorr.{Result, Normalizer, Downloaders}

  @doc """
  Parse HTML and extract results according to tracker config.
  """
  def parse(html, config) when is_binary(html) do
    parsing_config = config["parsing"] || %{}
    tracker_id = config["id"]
    base_url = config["base_url"]

    with {:ok, document} <- Floki.parse_document(html),
         result_nodes <- extract_result_nodes(document, parsing_config),
         results <- Enum.map(result_nodes, &parse_result(&1, parsing_config, tracker_id, base_url)) do
      results
      |> Enum.filter(&Result.valid?/1)
    else
      {:error, _reason} -> []
    end
  end

  def parse(_html, _config), do: []

  # --- Private ---

  defp extract_result_nodes(document, config) do
    selector = config["result_rows"] || "tr"
    nodes = Floki.find(document, selector)
    IO.puts("DEBUG: Found #{length(nodes)} result nodes with selector: #{selector}")
    nodes
  end

  defp parse_result(node, config, tracker_id, base_url) do
    fields = config["fields"] || %{}

    attrs = %{
      tracker_id: tracker_id,
      title: extract_field(node, fields["title"]),
      download_url: extract_url(node, fields["download_url"], base_url),
      magnet_url: extract_field(node, fields["magnet_url"]),
      detail_url: extract_url(node, fields["detail_url"], base_url),
      size_bytes: extract_size(node, fields["size"], fields["size_format"]),
      seeders: extract_int(node, fields["seeders"]),
      leechers: extract_int(node, fields["leechers"]),
      category: extract_field(node, fields["category"]),
      published_at: extract_date(node, fields["date"]),
      quality: extract_field(node, fields["quality"])
    }

    result = Result.new(attrs)

    # Fetch download URL for trackers that need it (e.g., DonTorrent with POW)
    result = maybe_fetch_download_url(result, tracker_id, base_url, config)

    IO.inspect(result, label: "DEBUG: Parsed result")
    result
  end

  # Fetch download URL for trackers with protected downloads
  defp maybe_fetch_download_url(result, "dontorrent", base_url, _config) do
    # Only fetch if we have detail_url but no download_url
    if result.detail_url && !result.download_url do
      case Downloaders.DonTorrent.get_download_url(result.detail_url, base_url) do
        {:ok, download_url} ->
          %{result | download_url: download_url}

        {:error, reason} ->
          require Logger
          Logger.warning("Failed to get DonTorrent download URL: #{inspect(reason)}")
          result
      end
    else
      result
    end
  end

  defp maybe_fetch_download_url(result, _tracker_id, _base_url, _config), do: result

  defp extract_field(_node, nil), do: nil

  defp extract_field(node, selector) when is_binary(selector) do
    # Handle multiple fallback selectors separated by comma
    selectors = String.split(selector, ",", trim: true)
    extract_with_fallbacks(node, selectors)
  end

  defp extract_with_fallbacks(_node, []), do: nil

  defp extract_with_fallbacks(node, [selector | rest]) do
    selector = String.trim(selector)

    case extract_single_field(node, selector) do
      nil -> extract_with_fallbacks(node, rest)
      "" -> extract_with_fallbacks(node, rest)
      value -> value
    end
  end

  defp extract_single_field(node, selector) do
    # Check if we're extracting an attribute: "a.link@href"
    case String.split(selector, "@", parts: 2) do
      [css_selector, attribute] ->
        node
        |> Floki.find(String.trim(css_selector))
        |> Floki.attribute(attribute)
        |> List.first()
        |> normalize_text()

      [css_selector] ->
        node
        |> Floki.find(css_selector)
        |> Floki.text(deep: true)
        |> normalize_text()
    end
  end

  defp extract_url(node, selector, base_url) do
    case extract_field(node, selector) do
      nil -> nil
      "" -> nil
      url -> resolve_url(url, base_url)
    end
  end

  defp resolve_url(url, base_url) when is_binary(url) do
    cond do
      String.starts_with?(url, "http://") or String.starts_with?(url, "https://") ->
        url

      String.starts_with?(url, "magnet:") ->
        url

      String.starts_with?(url, "//") ->
        "https:" <> url

      String.starts_with?(url, "/") and is_binary(base_url) ->
        # Relative URL - prepend base_url
        base = String.trim_trailing(base_url, "/")
        base <> url

      true ->
        # Just return as-is if we can't resolve it
        url
    end
  end

  defp extract_int(_node, nil), do: nil

  defp extract_int(node, selector) do
    case extract_field(node, selector) do
      nil -> nil
      text -> Normalizer.parse_int(text)
    end
  end

  defp extract_size(_node, nil, _format), do: nil

  defp extract_size(node, selector, format) do
    case extract_field(node, selector) do
      nil -> nil
      text -> Normalizer.parse_size(text, format)
    end
  end

  defp extract_date(_node, nil), do: nil

  defp extract_date(node, selector) do
    case extract_field(node, selector) do
      nil -> nil
      text -> Normalizer.parse_date(text)
    end
  end

  defp normalize_text(nil), do: nil
  defp normalize_text(""), do: nil

  defp normalize_text(text) when is_binary(text) do
    text
    |> String.trim()
    |> decode_html_entities()
  end

  defp decode_html_entities(text) do
    text
    |> String.replace("&amp;", "&")
    |> String.replace("&lt;", "<")
    |> String.replace("&gt;", ">")
    |> String.replace("&quot;", "\"")
    |> String.replace("&#39;", "'")
    |> String.replace("&nbsp;", " ")
  end
end
