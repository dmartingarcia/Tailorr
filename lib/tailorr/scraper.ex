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

  alias Tailorr.{Normalizer, Result}

  require Logger

  # Registry: downloader name declared in YAML → implementing module.
  # Add one line here when a new Downloaders.Behaviour module is created.
  @downloaders %{
    "dontorrent" => Tailorr.Downloaders.DonTorrent,
    "descargamix" => Tailorr.Downloaders.DescargaMix,
    "leet" => Tailorr.Downloaders.Leet
  }

  @doc """
  Parse HTML and extract results according to tracker config.
  """
  def parse(html, config) when is_binary(html) do
    parsing_config = config["parsing"] || %{}
    tracker_id = config["id"]
    base_url = config["base_url"]

    with {:ok, document} <- Floki.parse_document(html),
         result_nodes <- extract_result_nodes(document, parsing_config),
         results <-
           Enum.map(result_nodes, &parse_result(&1, parsing_config, tracker_id, base_url)) do
      results
      |> Enum.filter(&Result.valid?/1)
      |> Task.async_stream(
        &maybe_expand_result(&1, config),
        timeout: 25_000,
        max_concurrency: 2,
        on_timeout: :kill_task
      )
      |> Enum.flat_map(fn
        {:ok, expanded} -> expanded
        {:exit, _} -> []
      end)
    else
      {:error, _reason} -> []
    end
  end

  def parse(_html, _config), do: []

  # --- Private ---

  defp extract_result_nodes(document, config) do
    selector = config["result_rows"] || "tr"
    Floki.find(document, selector)
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

    Result.new(attrs)
  end

  # Dispatch to a tracker-declared downloader module (config["downloader"]).
  # Trackers that don't declare a downloader pass through unchanged.
  defp maybe_expand_result(result, config) do
    base_url = config["base_url"]
    season_pattern = config["season_url_pattern"]
    downloader = Map.get(@downloaders, config["downloader"])

    cond do
      downloader && season_pattern && result.detail_url &&
          String.contains?(result.detail_url, season_pattern) ->
        case downloader.expand_season(result.detail_url, base_url) do
          {:ok, []} ->
            [result]

          {:ok, episodes} ->
            Enum.map(episodes, &episode_to_result(&1, result))

          {:error, reason} ->
            Logger.warning(
              "#{config["id"]}: Failed to expand season #{result.detail_url}: #{inspect(reason)}"
            )

            [result]
        end

      downloader && is_nil(result.download_url) && not is_nil(result.detail_url) ->
        case downloader.get_download_url(result.detail_url, base_url) do
          {:ok, download_url} ->
            [%{result | download_url: download_url}]

          {:error, reason} ->
            Logger.warning(
              "#{config["id"]}: Failed to get download URL #{result.detail_url}: #{inspect(reason)}"
            )

            [result]
        end

      true ->
        [result]
    end
  end

  defp episode_to_result(ep, parent) do
    Result.new(%{
      tracker_id: parent.tracker_id,
      title: "#{parent.title} - #{ep.episode_title}",
      detail_url: parent.detail_url,
      download_url: ep.download_url,
      quality: parent.quality,
      category: parent.category,
      published_at: ep.published_at
    })
  end

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
