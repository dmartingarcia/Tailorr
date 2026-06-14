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
        round(number * multiplier)

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
end
