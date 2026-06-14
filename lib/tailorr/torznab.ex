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
    """
        <item>
          <title>#{escape_xml(result.title)}</title>
          <guid>#{result.tracker_id}-#{:erlang.phash2(result.title)}</guid>
          <link>#{escape_xml(result.download_url || result.magnet_url || result.detail_url || "")}</link>
          #{if result.download_url, do: "<enclosure url=\"#{escape_xml(result.download_url)}\" type=\"application/x-bittorrent\"/>", else: ""}
          #{if result.magnet_url, do: "<torznab:attr name=\"magneturl\" value=\"#{escape_xml(result.magnet_url)}\"/>", else: ""}
          #{if result.size_bytes, do: "<torznab:attr name=\"size\" value=\"#{result.size_bytes}\"/>", else: ""}
          #{if result.seeders, do: "<torznab:attr name=\"seeders\" value=\"#{result.seeders}\"/>", else: ""}
          #{if result.leechers, do: "<torznab:attr name=\"peers\" value=\"#{result.leechers}\"/>", else: ""}
          #{if result.category, do: "<torznab:attr name=\"category\" value=\"#{escape_xml(result.category)}\"/>", else: ""}
          #{if result.quality, do: "<torznab:attr name=\"quality\" value=\"#{escape_xml(result.quality)}\"/>", else: ""}
          <torznab:attr name=\"indexer\" value=\"#{result.tracker_id}\"/>
        </item>
    """
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
