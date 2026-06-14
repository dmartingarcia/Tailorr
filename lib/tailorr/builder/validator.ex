defmodule Tailorr.Builder.Validator do
  @moduledoc """
  Validates tracker YAML definitions.

  SRP: Only validates structure and required fields.
  """

  @required_fields ~w(id name agent search parsing)

  @doc """
  Validate a YAML string.

  Returns :ok or {:error, reason}.

  ## Examples

      iex> Validator.validate("id: test\\nname: Test\\n...")
      :ok

      iex> Validator.validate("invalid")
      {:error, "Missing required field: id"}
  """
  def validate(yaml_string) when is_binary(yaml_string) do
    case YamlElixir.read_from_string(yaml_string) do
      {:ok, config} -> validate_config(config)
      {:error, reason} -> {:error, "Invalid YAML: #{inspect(reason)}"}
    end
  end

  defp validate_config(config) when is_map(config) do
    missing_fields =
      @required_fields
      |> Enum.reject(&Map.has_key?(config, &1))

    case missing_fields do
      [] -> validate_parsing(config)
      [field | _] -> {:error, "Missing required field: #{field}"}
    end
  end

  defp validate_parsing(%{"parsing" => parsing}) when is_map(parsing) do
    if Map.has_key?(parsing, "fields") do
      :ok
    else
      {:error, "Missing parsing.fields"}
    end
  end

  defp validate_parsing(_) do
    {:error, "Invalid parsing configuration"}
  end
end
