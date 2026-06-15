defmodule Tailorr.Torznab do
  @moduledoc """
  Torznab XML format builder.

  Converts Tailorr.Result structs to Torznab-compatible XML.
  """

  alias Tailorr.Result

  @doc """
  Build Torznab RSS feed from search results.
  """
  def build_feed(results, query \\ "") do
    items = Enum.map(results, &build_item/1)

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:torznab="http://torznab.com/schemas/2015/feed">
      <channel>
        <title>Tailorr</title>
        <description>Tailorr Meta-Indexer Search Results</description>
        <link>http://localhost:4000</link>
        <language>es-ES</language>
        <atom:link href="http://localhost:4000/api" rel="self" type="application/rss+xml"/>
        #{if query != "", do: "<torznab:query>#{escape_xml(query)}</torznab:query>", else: ""}
        <torznab:response offset="0" total="#{length(results)}"/>
        #{Enum.join(items, "\n")}
      </channel>
    </rss>
    """
  end

  defp build_item(%Result{} = result) do
    link = escape_xml(result.download_url || result.magnet_url || result.detail_url || "")
    attrs = build_optional_attrs(result)

    """
        <item>
          <title>#{escape_xml(result.title)}</title>
          <guid>#{result.tracker_id}-#{:erlang.phash2(result.title)}</guid>
          <link>#{link}</link>
          #{attrs}
          <torznab:attr name=\"indexer\" value=\"#{result.tracker_id}\"/>
        </item>
    """
  end

  defp build_optional_attrs(result) do
    [
      optional_enclosure(result.download_url),
      optional_attr("magneturl", result.magnet_url),
      optional_int_attr("size", result.size_bytes),
      optional_int_attr("seeders", result.seeders),
      optional_int_attr("peers", result.leechers),
      optional_attr("category", result.category),
      optional_attr("quality", result.quality)
    ]
    |> Enum.reject(&(&1 == ""))
    |> Enum.join("\n          ")
  end

  defp optional_enclosure(nil), do: ""

  defp optional_enclosure(url) do
    "<enclosure url=\"#{escape_xml(url)}\" type=\"application/x-bittorrent\"/>"
  end

  defp optional_attr(_name, nil), do: ""

  defp optional_attr(name, value) do
    "<torznab:attr name=\"#{name}\" value=\"#{escape_xml(value)}\"/>"
  end

  defp optional_int_attr(_name, nil), do: ""

  defp optional_int_attr(name, value) do
    "<torznab:attr name=\"#{name}\" value=\"#{value}\"/>"
  end

  defp escape_xml(nil), do: ""

  defp escape_xml(text) when is_binary(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
    |> String.replace("'", "&apos;")
  end

  defp escape_xml(_), do: ""
end
