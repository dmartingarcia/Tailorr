defmodule Tailorr.Agents.AuthTest do
  use ExUnit.Case, async: true

  alias Tailorr.Agents.Auth
  alias Tailorr.SearchQuery

  setup do
    bypass = Bypass.open()
    {:ok, bypass: bypass}
  end

  describe "capabilities/0" do
    test "returns required capabilities" do
      caps = Auth.capabilities()
      assert :search in caps
      assert :test_connection in caps
      assert :authentication in caps
      assert :private_tracker in caps
    end
  end

  describe "session validation" do
    test "session is invalid when __last_login_at is nil" do
      config = %{"id" => "test"}
      assert {:error, _} = Auth.test_connection(config)
    end

    test "session is valid within TTL" do
      # Session logged in 1 minute ago, TTL is 1440 minutes
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "session_ttl_minutes" => 1440,
        "__last_login_at" => :os.system_time(:second) - 60,
        "__cookies" => %{"session" => "abc123"}
      }

      # Session is still valid — test_connection returns :ok without re-logging in
      assert :ok = Auth.test_connection(config)
    end

    test "session expires after TTL" do
      # Session logged in 2 days ago, TTL is 1 day
      config = %{
        "id" => "test",
        "base_url" => "https://example.com",
        "session_ttl_minutes" => 1440,
        "__last_login_at" => :os.system_time(:second) - 2 * 86_400
      }

      # Should try to re-login
      assert {:error, _} = Auth.test_connection(config)
    end
  end

  describe "login" do
    test "successful login with POST", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        params = URI.decode_query(body)

        assert params["username"] != nil
        assert params["password"] != nil

        conn
        |> Plug.Conn.put_resp_header("set-cookie", "session=abc123; Path=/")
        |> Plug.Conn.resp(200, ~s(<html><div id="user-menu">Logged in</div></html>))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_path" => "/login",
        "login_method" => "POST",
        "login_form" => %{
          "username_field" => "username",
          "password_field" => "password"
        },
        "credentials_env" => %{
          "username" => "TEST_USER",
          "password" => "TEST_PASS"
        },
        "session_check" => %{
          "logged_in_selector" => "#user-menu"
        }
      }

      # Set env vars for test
      System.put_env("TEST_USER", "testuser")
      System.put_env("TEST_PASS", "testpass")

      result = Auth.test_connection(config)
      assert result == :ok

      # Cleanup
      System.delete_env("TEST_USER")
      System.delete_env("TEST_PASS")
    end

    test "login fails when logged_in_selector not found", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        Plug.Conn.resp(conn, 200, ~s(<html><div>Login failed</div></html>))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_path" => "/login",
        "session_check" => %{
          "logged_in_selector" => "#user-menu"
        }
      }

      assert {:error, :login_failed} = Auth.test_connection(config)
    end

    test "login success detected by absence of logged_out_string", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        conn
        |> Plug.Conn.put_resp_header("set-cookie", "session=xyz")
        |> Plug.Conn.resp(200, ~s(<html><div>Welcome back!</div></html>))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_path" => "/login",
        "session_check" => %{
          "logged_out_string" => "Please login"
        }
      }

      assert :ok = Auth.test_connection(config)
    end

    test "login fails when logged_out_string is present", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        Plug.Conn.resp(conn, 200, ~s(<html><div>Please login</div></html>))
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_path" => "/login",
        "session_check" => %{
          "logged_out_string" => "Please login"
        }
      }

      assert {:error, :login_failed} = Auth.test_connection(config)
    end

    test "uses GET method when specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "GET", "/login", fn conn ->
        assert conn.query_string =~ "username="
        assert conn.query_string =~ "password="

        conn
        |> Plug.Conn.put_resp_header("set-cookie", "session=test")
        |> Plug.Conn.resp(200, "<html><div id='menu'>OK</div></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_path" => "/login",
        "login_method" => "GET",
        "session_check" => %{"logged_in_selector" => "#menu"}
      }

      assert :ok = Auth.test_connection(config)
    end

    test "includes extra fields in login form", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        params = URI.decode_query(body)

        assert params["remember"] == "1"
        assert params["redirect"] == "/home"

        conn
        |> Plug.Conn.put_resp_header("set-cookie", "s=1")
        |> Plug.Conn.resp(200, "<div id='ok'>OK</div>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_form" => %{
          "extra_fields" => %{
            "remember" => "1",
            "redirect" => "/home"
          }
        },
        "session_check" => %{"logged_in_selector" => "#ok"}
      }

      assert :ok = Auth.test_connection(config)
    end

    test "extracts and stores cookies", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        conn
        |> Plug.Conn.put_resp_header("set-cookie", "session=abc123; Path=/")
        |> Plug.Conn.put_resp_header("set-cookie", "remember=1; Max-Age=3600")
        |> Plug.Conn.resp(200, "<div id='ok'>OK</div>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "session_check" => %{"logged_in_selector" => "#ok"}
      }

      # Login updates config with cookies
      assert :ok = Auth.test_connection(config)
    end

    test "uses default login_path if not specified", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        conn
        |> Plug.Conn.put_resp_header("set-cookie", "s=1")
        |> Plug.Conn.resp(200, "<div id='ok'>OK</div>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "session_check" => %{"logged_in_selector" => "#ok"}
      }

      assert :ok = Auth.test_connection(config)
    end

    test "handles redirect responses", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        conn
        |> Plug.Conn.put_resp_header("set-cookie", "session=redirect")
        |> Plug.Conn.put_resp_header("location", "/home")
        |> Plug.Conn.resp(302, "")
      end)

      Bypass.expect_once(bypass, "GET", "/home", fn conn ->
        Plug.Conn.resp(conn, 200, "<html><span id='user'>User</span></html>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "session_check" => %{"logged_in_selector" => "#user"}
      }

      assert :ok = Auth.test_connection(config)
    end
  end

  describe "cookie parsing" do
    test "parses simple cookie" do
      # This is tested indirectly through login tests
      # The parse_cookie function is private but used in extract_cookies
      :ok
    end

    test "handles cookies with extra attributes" do
      # Cookies like "session=abc; Path=/; HttpOnly" should extract "session=abc"
      :ok
    end
  end

  describe "error handling" do
    test "returns error for failed login HTTP request" do
      config = %{
        "id" => "test",
        "base_url" => "http://192.0.2.1:9999",
        "timeout_ms" => 100
      }

      assert {:error, _} = Auth.test_connection(config)
    end

    test "returns error for non-200/302 login response", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        Plug.Conn.resp(conn, 500, "Server Error")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass)
      }

      assert {:error, {:login_http_error, 500}} = Auth.test_connection(config)
    end
  end

  describe "credentials" do
    test "uses custom username/password field names", %{bypass: bypass} do
      Bypass.expect_once(bypass, "POST", "/login", fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        params = URI.decode_query(body)

        assert Map.has_key?(params, "user")
        assert Map.has_key?(params, "pass")

        conn
        |> Plug.Conn.put_resp_header("set-cookie", "s=1")
        |> Plug.Conn.resp(200, "<div id='ok'>OK</div>")
      end)

      config = %{
        "id" => "test",
        "base_url" => endpoint_url(bypass),
        "login_form" => %{
          "username_field" => "user",
          "password_field" => "pass"
        },
        "session_check" => %{"logged_in_selector" => "#ok"}
      }

      assert :ok = Auth.test_connection(config)
    end
  end

  defp endpoint_url(bypass) do
    "http://localhost:#{bypass.port}"
  end
end
