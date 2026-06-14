defmodule Tailorr.TrackerLoader do
  @moduledoc """
  Loads and validates tracker definitions from YAML files.

  Scans tracker_definitions/{public,private}/ for .yml files,
  parses them, validates structure, and returns tracker configs
  ready to spawn into Tracker GenServers.
  """

  require Logger

  @tracker_definitions_path "tracker_definitions"

  @doc """
  Load all tracker definitions from the tracker_definitions directory.
  Returns a map of tracker_id => config.
  """
  def load_all do
    trackers =
      [@tracker_definitions_path <> "/public", @tracker_definitions_path <> "/private"]
      |> Enum.flat_map(&load_from_directory/1)
      |> Map.new(fn config -> {config["id"], config} end)

    Logger.info("Loaded #{map_size(trackers)} tracker definitions")
    trackers
  end

  @doc """
  Load a single tracker by ID.
  """
  def load_one(tracker_id) do
    all_trackers = load_all()
    Map.get(all_trackers, tracker_id)
  end

  @doc """
  Load all tracker YAML files from a directory.
  """
  def load_from_directory(dir_path) do
    case File.ls(dir_path) do
      {:ok, files} ->
        files
        |> Enum.filter(&String.ends_with?(&1, ".yml"))
        |> Enum.map(&Path.join(dir_path, &1))
        |> Enum.map(&load_file/1)
        |> Enum.reject(&is_nil/1)

      {:error, :enoent} ->
        Logger.warning("Tracker definitions directory not found: #{dir_path}")
        []

      {:error, reason} ->
        Logger.error("Failed to read tracker definitions directory #{dir_path}: #{inspect(reason)}")
        []
    end
  end

  # --- Private ---

  defp load_file(file_path) do
    case YamlElixir.read_from_file(file_path) do
      {:ok, config} when is_map(config) ->
        if valid_config?(config) do
          config
        else
          Logger.warning("Invalid tracker config in #{file_path}: missing required fields")
          nil
        end

      {:error, reason} ->
        Logger.error("Failed to parse YAML file #{file_path}: #{inspect(reason)}")
        nil
    end
  end

  defp valid_config?(config) do
    required_fields = ["id", "name", "agent", "base_url"]
    Enum.all?(required_fields, &Map.has_key?(config, &1))
  end
end
