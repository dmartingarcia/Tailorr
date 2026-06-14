defmodule Tailorr.Agents.Auth do
  @moduledoc """
  Agent for private trackers that require a login session.

  Login flow:
    1. POST credentials to the tracker's login endpoint
    2. Extract and persist session cookies / JWT token
    3. Use those credentials for all subsequent search requests (via HttpAgent)
    4. On 401 / session expiry detected in HTML, re-authenticate automatically

  Credentials are never stored in YAML definitions. They must be provided
  via environment variables or the Tailorr secrets file (encrypted at rest).

  ## YAML config keys
      agent: auth
      base_url: "https://private-tracker.com"
      search_path: "/browse.php"
      login_path: "/login.php"
      login_method: POST                # POST | GET
      login_form:
        username_field: "username"
        password_field: "password"
        extra_fields:                   # hidden fields, CSRF tokens, etc.
          remember: "1"
      credentials_env:
        username: TRACKER_USERNAME      # env var name (not value)
        password: TRACKER_PASSWORD
      session_check:
        # CSS selector that appears only when logged in
        logged_in_selector: "#user-menu"
        # or: detect logout by this string in the response body
        logged_out_string: "Please login"
      session_ttl_minutes: 1440         # re-login after this period
      use_cloudflare: false             # set to true if site also has CF
  """

  @behaviour Tailorr.Agents.Behaviour

  alias Tailorr.{Result, SearchQuery, Scraper}
  alias Tailorr.Agents.{Http, Cloudflare}

  @impl true
  def capabilities, do: [:search, :test_connection, :authentication, :private_tracker]

  @impl true
  def search(config, %SearchQuery{} = query) do
    with {:ok, session_config} <- ensure_session(config),
         {:ok, results} <- do_search(session_config, query) do
      {:ok, results}
    end
  end

  @impl true
  def test_connection(config) do
    case ensure_session(config) do
      {:ok, _} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  # --- Private ---

  defp ensure_session(config) do
    case session_valid?(config) do
      true -> {:ok, config}
      false -> login(config)
    end
  end

  defp session_valid?(config) do
    last_login = Map.get(config, "__last_login_at")
    ttl = Map.get(config, "session_ttl_minutes", 1440) * 60

    case last_login do
      nil -> false
      ts -> :os.system_time(:second) - ts < ttl
    end
  end

  defp login(config) do
    login_path = config["login_path"] || "/login"
    url = config["base_url"] <> login_path
    method = Map.get(config, "login_method", "POST")
    form = build_login_form(config)

    result =
      case method do
        "GET" -> Req.get(url, params: form)
        _ -> Req.post(url, form: form, follow_redirects: true)
      end

    case result do
      {:ok, %{status: s, headers: headers, body: body}} when s in [200, 302] ->
        if logged_in?(body, config) do
          cookies = extract_cookies(headers)

          {:ok,
           Map.merge(config, %{
             "__cookies" => cookies,
             "__last_login_at" => :os.system_time(:second)
           })}
        else
          {:error, :login_failed}
        end

      {:ok, %{status: s}} ->
        {:error, {:login_http_error, s}}

      {:error, reason} ->
        {:error, {:login_request_failed, reason}}
    end
  end

  defp do_search(config, query) do
    if Map.get(config, "use_cloudflare", false) do
      Cloudflare.search(config, query)
    else
      Http.search(config, query)
    end
  end

  defp build_login_form(config) do
    form = config["login_form"] || %{}
    env_creds = config["credentials_env"] || %{}

    username_field = form["username_field"] || "username"
    password_field = form["password_field"] || "password"
    extra = form["extra_fields"] || %{}

    username = System.get_env(env_creds["username"] || "TRACKER_USERNAME_#{slug(config)}")
    password = System.get_env(env_creds["password"] || "TRACKER_PASSWORD_#{slug(config)}")

    Map.merge(extra, %{username_field => username, password_field => password})
  end

  defp logged_in?(body, config) do
    check = config["session_check"] || %{}

    cond do
      selector = check["logged_in_selector"] ->
        {:ok, doc} = Floki.parse_document(body)
        Floki.find(doc, selector) != []

      logged_out = check["logged_out_string"] ->
        not String.contains?(body, logged_out)

      true ->
        true
    end
  end

  defp extract_cookies(headers) do
    headers
    |> Enum.filter(fn {k, _} -> String.downcase(k) == "set-cookie" end)
    |> Enum.map(fn {_, v} -> parse_cookie(v) end)
    |> Map.new()
  end

  defp parse_cookie(cookie_str) do
    [kv | _] = String.split(cookie_str, ";")
    [k, v] = String.split(kv, "=", parts: 2)
    {String.trim(k), String.trim(v)}
  end

  defp slug(config) do
    config
    |> Map.get("id", "unknown")
    |> String.upcase()
    |> String.replace(~r/[^A-Z0-9]/, "_")
  end
end
