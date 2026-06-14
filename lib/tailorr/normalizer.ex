defmodule Tailorr.Normalizer do
  @moduledoc """
  Normalizes scraped data (sizes, dates, numbers) into consistent formats.
  """

  @doc """
  Parse human-readable file size to bytes.

  Examples:
  - "1.5 GB" -> 1_610_612_736
  - "750 MB" -> 786_432_000
  - "2.3 GiB" -> 2_469_606_195
  """
  def parse_size(nil, _format), do: nil
  def parse_size("", _format), do: nil

  def parse_size(text, _format) when is_binary(text) do
    # Extract number and unit
    case Regex.run(~r/([\d.,]+)\s*([KMGT]i?B)/i, text) do
      [_, number_str, unit] ->
        number = parse_float(number_str)
        multiplier = size_multiplier(unit)
        trunc(number * multiplier)

      nil ->
        # Try just extracting a number (already in bytes)
        parse_int(text)
    end
  end

  @doc """
  Parse date/time string to DateTime.

  Supports:
  - ISO8601: "2024-01-15T10:30:00Z"
  - Relative: "2 hours ago", "3 days ago"
  - Common formats: "Jan 15, 2024", "15/01/2024"
  """
  def parse_date(nil), do: nil
  def parse_date(""), do: nil

  def parse_date(text) when is_binary(text) do
    cond do
      # ISO8601 format
      String.contains?(text, "T") and String.contains?(text, "Z") ->
        case DateTime.from_iso8601(text) do
          {:ok, datetime, _offset} -> datetime
          {:error, _} -> nil
        end

      # Relative dates: "2 hours ago", "3 days ago"
      String.contains?(text, "ago") ->
        parse_relative_date(text)

      # Give up for now - extend as needed
      true ->
        nil
    end
  end

  @doc """
  Parse a Torznab RSS/XML response body into a list of Result structs.
  """
  def from_torznab_xml(body) when is_binary(body) do
    case Floki.parse_document(body) do
      {:ok, doc} ->
        results =
          Floki.find(doc, "item")
          |> Enum.map(&parse_torznab_item/1)
          |> Enum.reject(&is_nil/1)

        {:ok, results}

      {:error, reason} ->
        {:error, {:parse_error, reason}}
    end
  end

  @doc """
  Parse a Newznab RSS/XML response body into a list of Result structs.
  """
  def from_newznab_xml(body) when is_binary(body), do: from_torznab_xml(body)

  @doc """
  Parse a generic RSS feed body into a list of Result structs.
  """
  def from_rss(body) when is_binary(body) do
    case Floki.parse_document(body) do
      {:ok, doc} ->
        results =
          Floki.find(doc, "item")
          |> Enum.map(&parse_rss_item/1)
          |> Enum.reject(&is_nil/1)

        {:ok, results}

      {:error, reason} ->
        {:error, {:parse_error, reason}}
    end
  end

  @doc """
  Parse a JSON API response body into a list of Result structs using a field mapping.
  """
  def from_json(body, mapping) when is_binary(body) do
    case Jason.decode(body) do
      {:ok, data} ->
        items = get_json_items(data, mapping)

        results =
          items
          |> Enum.map(&map_json_item(&1, mapping))
          |> Enum.reject(&is_nil/1)

        {:ok, results}

      {:error, reason} ->
        {:error, {:json_decode_error, reason}}
    end
  end

  @doc """
  Parse integer from text, ignoring non-numeric characters.
  """
  def parse_int(nil), do: nil
  def parse_int(""), do: nil
  def parse_int(text) when is_integer(text), do: text

  def parse_int(text) when is_binary(text) do
    # Remove everything except digits
    clean = String.replace(text, ~r/[^\d]/, "")

    case Integer.parse(clean) do
      {int, _} -> int
      :error -> nil
    end
  end

  # --- Private ---

  defp parse_float(str) do
    # Handle both "." and "," as decimal separators
    normalized = String.replace(str, ",", ".")

    case Float.parse(normalized) do
      {float, _} -> float
      :error -> 0.0
    end
  end

  defp size_multiplier(unit) do
    case String.downcase(unit) do
      "kb" -> 1_000
      "kib" -> 1_024
      "mb" -> 1_000_000
      "mib" -> 1_048_576
      "gb" -> 1_000_000_000
      "gib" -> 1_073_741_824
      "tb" -> 1_000_000_000_000
      "tib" -> 1_099_511_627_776
      _ -> 1
    end
  end

  defp parse_relative_date(text) do
    # Extract number and unit from "X [units] ago"
    case Regex.run(~r/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i, text) do
      [_, amount_str, unit] ->
        amount = String.to_integer(amount_str)
        offset_seconds = relative_offset_seconds(amount, unit)
        DateTime.add(DateTime.utc_now(), -offset_seconds, :second)

      nil ->
        nil
    end
  end

  defp relative_offset_seconds(amount, unit) do
    case String.downcase(unit) do
      "second" -> amount
      "minute" -> amount * 60
      "hour" -> amount * 3600
      "day" -> amount * 86_400
      "week" -> amount * 604_800
      "month" -> amount * 2_592_000
      "year" -> amount * 31_536_000
      _ -> 0
    end
  end

  defp parse_torznab_item(item) do
    title = Floki.find(item, "title") |> Floki.text()
    link = Floki.find(item, "link") |> Floki.text()

    if title == "" do
      nil
    else
      %Tailorr.Result{
        title: title,
        download_url: link,
        tracker_id: "api"
      }
    end
  end

  defp parse_rss_item(item) do
    title = Floki.find(item, "title") |> Floki.text()
    link = Floki.find(item, "link") |> Floki.text()

    if title == "" do
      nil
    else
      %Tailorr.Result{title: title, download_url: link, tracker_id: "rss"}
    end
  end

  defp get_json_items(data, mapping) when is_map(mapping) do
    results_key = Map.get(mapping, "results_key", "results")

    case data do
      %{^results_key => items} when is_list(items) -> items
      items when is_list(items) -> items
      _ -> []
    end
  end

  defp get_json_items(data, _mapping) when is_list(data), do: data
  defp get_json_items(_, _), do: []

  defp map_json_item(item, mapping) when is_map(item) and is_map(mapping) do
    title = Map.get(item, Map.get(mapping, "title", "title"))

    if is_nil(title) or title == "" do
      nil
    else
      %Tailorr.Result{
        title: to_string(title),
        download_url: Map.get(item, Map.get(mapping, "download_url", "download_url")),
        tracker_id: "json"
      }
    end
  end

  defp map_json_item(_, _), do: nil
end
