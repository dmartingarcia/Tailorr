defmodule Tailorr.Builder.ValidatorTest do
  use ExUnit.Case, async: true

  alias Tailorr.Builder.Validator

  @valid_yaml """
  id: my_tracker
  name: My Tracker
  agent: http
  search:
    url: "https://example.com/search?q={query}"
  parsing:
    result_rows: "tr.result"
    fields:
      title: "td.title a"
      download_url: "td.download a::attr(href)"
  """

  describe "validate/1" do
    test "returns :ok for a fully valid YAML string" do
      assert :ok = Validator.validate(@valid_yaml)
    end

    test "returns error for empty string" do
      result = Validator.validate("")
      assert {:error, _reason} = result
    end

    test "returns error for non-YAML string" do
      assert {:error, _reason} = Validator.validate("this is not yaml: : :")
    end

    test "returns error when id field is missing" do
      yaml = """
      name: My Tracker
      agent: http
      search:
        url: "https://example.com"
      parsing:
        fields:
          title: "h2 a"
      """

      assert {:error, "Missing required field: id"} = Validator.validate(yaml)
    end

    test "returns error when name field is missing" do
      yaml = """
      id: my_tracker
      agent: http
      search:
        url: "https://example.com"
      parsing:
        fields:
          title: "h2 a"
      """

      assert {:error, "Missing required field: name"} = Validator.validate(yaml)
    end

    test "returns error when agent field is missing" do
      yaml = """
      id: my_tracker
      name: My Tracker
      search:
        url: "https://example.com"
      parsing:
        fields:
          title: "h2 a"
      """

      assert {:error, "Missing required field: agent"} = Validator.validate(yaml)
    end

    test "returns error when search field is missing" do
      yaml = """
      id: my_tracker
      name: My Tracker
      agent: http
      parsing:
        fields:
          title: "h2 a"
      """

      assert {:error, "Missing required field: search"} = Validator.validate(yaml)
    end

    test "returns error when parsing field is missing" do
      yaml = """
      id: my_tracker
      name: My Tracker
      agent: http
      search:
        url: "https://example.com"
      """

      assert {:error, "Missing required field: parsing"} = Validator.validate(yaml)
    end

    test "returns error when parsing.fields is missing" do
      yaml = """
      id: my_tracker
      name: My Tracker
      agent: http
      search:
        url: "https://example.com"
      parsing:
        result_rows: "tr"
      """

      assert {:error, "Missing parsing.fields"} = Validator.validate(yaml)
    end

    test "returns error when parsing is not a map" do
      yaml = """
      id: my_tracker
      name: My Tracker
      agent: http
      search:
        url: "https://example.com"
      parsing: "just a string"
      """

      assert {:error, _reason} = Validator.validate(yaml)
    end

    test "returns :ok when parsing has fields key with empty map" do
      yaml = """
      id: my_tracker
      name: My Tracker
      agent: http
      search:
        url: "https://example.com"
      parsing:
        fields: {}
      """

      assert :ok = Validator.validate(yaml)
    end

    test "returns :ok for cloudflare agent" do
      yaml = """
      id: cf_tracker
      name: CF Tracker
      agent: cloudflare
      search:
        url: "https://example.com"
      parsing:
        fields:
          title: "h2 a"
      """

      assert :ok = Validator.validate(yaml)
    end

    test "returns :ok for browser agent" do
      yaml = """
      id: browser_tracker
      name: Browser Tracker
      agent: browser
      search:
        url: "https://example.com"
      parsing:
        fields:
          title: "h2 a"
      """

      assert :ok = Validator.validate(yaml)
    end

    test "error message mentions the first missing field" do
      yaml = "id: t\n"
      {:error, reason} = Validator.validate(yaml)
      assert is_binary(reason)
      assert reason =~ "Missing required field:"
    end

    test "returns :ok with extra non-required fields present" do
      yaml = """
      id: extended_tracker
      name: Extended Tracker
      agent: http
      description: "An extended tracker with extra fields"
      enabled: true
      search:
        url: "https://example.com"
        method: GET
      parsing:
        result_rows: "tr"
        fields:
          title: "td a"
          size: "td.size"
      """

      assert :ok = Validator.validate(yaml)
    end
  end
end
