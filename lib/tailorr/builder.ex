defmodule Tailorr.Builder do
  @moduledoc """
  Context for tracker builder operations.

  SRP: Only handles tracker definition generation/validation/storage.

  Public API for:
  - Generating YAML from selectors
  - Validating definitions
  - Saving definitions to files
  - Testing selectors against live pages
  """

  alias Tailorr.Builder.{Validator, YamlGenerator}

  @definitions_path "tracker_definitions"

  @doc """
  Generate YAML from selector map.

  ## Examples

      iex> Builder.generate_yaml(%{"title" => "h2.title a"}, %{id: "test"})
      {:ok, yaml_string}
  """
  def generate_yaml(selectors, config) when is_map(selectors) do
    YamlGenerator.build(selectors, config)
  end

  @doc """
  Validate tracker definition.

  ## Examples

      iex> Builder.validate_definition(yaml_string)
      :ok
  """
  def validate_definition(yaml_string) when is_binary(yaml_string) do
    Validator.validate(yaml_string)
  end

  @doc """
  Test selectors against a live page.

  TODO: Implement in Phase 3 with Browser service.

  ## Examples

      iex> Builder.test_selectors(%{"title" => "h2 a"}, "https://example.com")
      {:ok, [%{title: "Result 1"}, ...]}
  """
  def test_selectors(_selectors, _url) do
    {:error, :not_implemented}
  end

  @doc """
  Save tracker definition to file.

  ## Examples

      iex> Builder.save_definition(yaml_string, "my_tracker")
      :ok
  """
  def save_definition(yaml_string, tracker_id) do
    with :ok <- validate_definition(yaml_string),
         path <- build_file_path(tracker_id),
         :ok <- ensure_directory(path),
         :ok <- File.write(path, yaml_string) do
      :ok
    else
      {:error, _} = error -> error
    end
  end

  defp build_file_path(tracker_id) do
    sanitized_id = String.replace(tracker_id, ~r/[^a-zA-Z0-9_-]/, "_")
    Path.join([@definitions_path, "public", "#{sanitized_id}.yml"])
  end

  defp ensure_directory(file_path) do
    file_path
    |> Path.dirname()
    |> File.mkdir_p()
  end
end
