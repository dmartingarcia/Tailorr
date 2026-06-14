defmodule Tailorr.BuilderTest do
  use ExUnit.Case, async: true

  alias Tailorr.Builder

  @valid_yaml """
  id: test_tracker
  name: Test Tracker
  agent: http
  search:
    url: "https://example.com/search?q={query}"
  parsing:
    result_rows: "tr.result"
    fields:
      title: "td.title a"
      download_url: "td.download a::attr(href)"
  """

  describe "generate_yaml/2" do
    test "returns {:ok, yaml_string} for valid selectors and config" do
      selectors = %{"title" => "h2 a", "download" => "a.torrent"}

      config = %{
        id: "test",
        name: "Test",
        agent: "http",
        search_url: "https://example.com/search",
        result_rows: "tr.result"
      }

      assert {:ok, yaml} = Builder.generate_yaml(selectors, config)
      assert is_binary(yaml)
    end

    test "yaml output contains the provided id" do
      {:ok, yaml} = Builder.generate_yaml(%{}, %{id: "my_tracker"})
      assert yaml =~ "id: my_tracker"
    end

    test "yaml output contains the provided name" do
      {:ok, yaml} = Builder.generate_yaml(%{}, %{id: "t", name: "My Tracker"})
      assert yaml =~ "name: My Tracker"
    end

    test "yaml output contains the provided agent" do
      {:ok, yaml} = Builder.generate_yaml(%{}, %{id: "t", agent: "cloudflare"})
      assert yaml =~ "agent: cloudflare"
    end

    test "yaml output contains the provided search_url" do
      {:ok, yaml} = Builder.generate_yaml(%{}, %{id: "t", search_url: "https://tracker.org/q"})
      assert yaml =~ "https://tracker.org/q"
    end

    test "yaml output contains the title selector" do
      {:ok, yaml} = Builder.generate_yaml(%{"title" => "h1.title a"}, %{id: "t"})
      assert yaml =~ "h1.title a"
    end

    test "accepts empty selectors map" do
      assert {:ok, _yaml} = Builder.generate_yaml(%{}, %{id: "t"})
    end

    test "uses defaults when config keys are missing" do
      {:ok, yaml} = Builder.generate_yaml(%{}, %{})
      assert yaml =~ "id: new_tracker"
      assert yaml =~ "name: New Tracker"
      assert yaml =~ "agent: http"
    end
  end

  describe "validate_definition/1" do
    test "returns :ok for a valid YAML string" do
      assert :ok = Builder.validate_definition(@valid_yaml)
    end

    test "returns {:error, reason} when id is missing" do
      yaml = String.replace(@valid_yaml, "id: test_tracker\n", "")
      assert {:error, "Missing required field: id"} = Builder.validate_definition(yaml)
    end

    test "returns {:error, reason} when name is missing" do
      yaml = String.replace(@valid_yaml, "name: Test Tracker\n", "")
      assert {:error, "Missing required field: name"} = Builder.validate_definition(yaml)
    end

    test "returns {:error, reason} when agent is missing" do
      yaml = String.replace(@valid_yaml, "agent: http\n", "")
      assert {:error, "Missing required field: agent"} = Builder.validate_definition(yaml)
    end

    test "returns {:error, reason} when parsing.fields is missing" do
      yaml = """
      id: test_tracker
      name: Test Tracker
      agent: http
      search:
        url: "https://example.com"
      parsing:
        result_rows: "tr"
      """

      assert {:error, "Missing parsing.fields"} = Builder.validate_definition(yaml)
    end

    test "returns {:error, reason} for invalid YAML" do
      assert {:error, _reason} = Builder.validate_definition("not: valid: yaml: : :")
    end

    test "accepts only binary input (guards against non-binary)" do
      # Ensure the function clause guard `when is_binary` is active —
      # calling with a non-binary raises FunctionClauseError
      assert_raise FunctionClauseError, fn ->
        Builder.validate_definition(42)
      end
    end
  end

  describe "test_selectors/2" do
    test "returns {:error, :not_implemented}" do
      assert {:error, :not_implemented} =
               Builder.test_selectors(%{"title" => "h2 a"}, "https://example.com")
    end

    test "returns {:error, :not_implemented} regardless of arguments" do
      assert {:error, :not_implemented} = Builder.test_selectors(%{}, "")
      assert {:error, :not_implemented} = Builder.test_selectors(nil, nil)
    end
  end

  describe "save_definition/2" do
    setup do
      tmp = System.tmp_dir!()
      original_cwd = File.cwd!()

      # Change to a tmp working directory so @definitions_path resolves inside it
      unique_dir = Path.join(tmp, "tailorr_builder_test_#{:erlang.unique_integer([:positive])}")
      File.mkdir_p!(unique_dir)
      File.cd!(unique_dir)

      on_exit(fn ->
        File.cd!(original_cwd)
        File.rm_rf!(unique_dir)
      end)

      %{test_dir: unique_dir}
    end

    test "returns :ok and writes the file for a valid definition" do
      assert :ok = Builder.save_definition(@valid_yaml, "test_tracker")
      assert File.exists?("tracker_definitions/public/test_tracker.yml")
    end

    test "file content matches the provided yaml_string" do
      :ok = Builder.save_definition(@valid_yaml, "content_check")
      content = File.read!("tracker_definitions/public/content_check.yml")
      assert content == @valid_yaml
    end

    test "sanitizes special characters in tracker_id" do
      :ok = Builder.save_definition(@valid_yaml, "My Tracker!")
      # Special chars replaced with underscores
      assert File.exists?("tracker_definitions/public/My_Tracker_.yml")
    end

    test "creates intermediate directories if they do not exist" do
      refute File.exists?("tracker_definitions/public")
      :ok = Builder.save_definition(@valid_yaml, "new_tracker")
      assert File.dir?("tracker_definitions/public")
    end

    test "returns {:error, _} for an invalid YAML definition" do
      invalid_yaml = "id: only_id\n"
      assert {:error, _reason} = Builder.save_definition(invalid_yaml, "bad_tracker")
    end

    test "does not create a file when definition is invalid" do
      invalid_yaml = "id: only_id\n"
      Builder.save_definition(invalid_yaml, "bad_tracker")
      refute File.exists?("tracker_definitions/public/bad_tracker.yml")
    end

    test "overwrites an existing file with the same tracker_id" do
      :ok = Builder.save_definition(@valid_yaml, "overwrite_me")

      updated_yaml = String.replace(@valid_yaml, "Test Tracker", "Updated Tracker")
      :ok = Builder.save_definition(updated_yaml, "overwrite_me")

      content = File.read!("tracker_definitions/public/overwrite_me.yml")
      assert content =~ "Updated Tracker"
    end
  end
end
