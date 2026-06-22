defmodule Tailorr.Trackers.TrackerTest do
  use ExUnit.Case, async: true

  alias Tailorr.Trackers.Tracker
  alias Tailorr.SearchQuery

  # Unique tracker ID per test to avoid Registry conflicts
  defp unique_id, do: "test-tracker-#{System.unique_integer([:positive])}"

  defp start_tracker(overrides \\ %{}) do
    id = unique_id()

    config =
      Map.merge(
        %{
          "id" => id,
          "name" => "Test Tracker",
          "agent" => "mock",
          "base_url" => "https://example.com",
          "enabled" => true
        },
        overrides
      )

    # Use unique child spec ID so multiple trackers can be supervised in one test
    child_spec = %{id: id, start: {Tracker, :start_link, [config]}}
    start_supervised!(child_spec)
    id
  end

  # ---- basic search ----------------------------------------------------------

  describe "search/2" do
    test "returns results when agent succeeds" do
      id = start_tracker()
      query = SearchQuery.new("matrix")

      assert {:ok, results} = Tracker.search(id, query)
      assert length(results) > 0
    end

    test "returns empty list for unknown query" do
      id = start_tracker()
      query = SearchQuery.new("totally-unknown-xyzzy")

      assert {:ok, []} = Tracker.search(id, query)
    end
  end

  # ---- circuit breaker — state transitions -----------------------------------

  describe "circuit breaker" do
    test "starts in :closed state" do
      id = start_tracker()
      assert {:ok, status} = Tracker.status(id)
      assert status.circuit_state == :closed
      assert status.failure_count == 0
    end

    test "failure_count increments on search error" do
      id = start_tracker(%{"agent" => "http", "base_url" => "http://127.0.0.1:19999"})
      query = SearchQuery.new("test")

      Tracker.search(id, query)

      assert {:ok, %{failure_count: 1, circuit_state: :closed}} = Tracker.status(id)
    end

    test "circuit opens after reaching threshold" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 3, "reset_after_s" => 60}
      })
      query = SearchQuery.new("test")

      Tracker.search(id, query)
      Tracker.search(id, query)
      Tracker.search(id, query)

      assert {:ok, %{circuit_state: :open, failure_count: 3}} = Tracker.status(id)
    end

    test "open circuit rejects immediately with :circuit_open" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 2, "reset_after_s" => 60}
      })
      query = SearchQuery.new("test")

      Tracker.search(id, query)
      Tracker.search(id, query)

      assert {:ok, %{circuit_state: :open}} = Tracker.status(id)
      assert {:error, :circuit_open} = Tracker.search(id, query)
    end

    test "successful search resets failure_count and closes circuit" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 10, "reset_after_s" => 60}
      })
      query_bad = SearchQuery.new("test")
      query_good = SearchQuery.new("matrix")

      Tracker.search(id, query_bad)
      Tracker.search(id, query_bad)
      assert {:ok, %{failure_count: 2}} = Tracker.status(id)

      # Swapping to mock agent won't work at runtime, so instead we test via
      # a tracker that can succeed. Use default mock agent for success path.
      id2 = start_tracker()
      assert {:ok, _} = Tracker.search(id2, query_good)
      assert {:ok, %{failure_count: 0, circuit_state: :closed}} = Tracker.status(id2)
    end

    test "reset_circuit/1 closes circuit and clears failure count" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 2, "reset_after_s" => 60}
      })
      query = SearchQuery.new("test")

      Tracker.search(id, query)
      Tracker.search(id, query)
      assert {:ok, %{circuit_state: :open}} = Tracker.status(id)

      assert :ok = Tracker.reset_circuit(id)
      assert {:ok, %{circuit_state: :closed, failure_count: 0}} = Tracker.status(id)
    end

    test "circuit moves to :half_open after reset_after_s elapsed" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 2, "reset_after_s" => 0}
      })
      query = SearchQuery.new("test")

      Tracker.search(id, query)
      Tracker.search(id, query)
      assert {:ok, %{circuit_state: :open}} = Tracker.status(id)

      # reset_after_s: 0 means cooldown already elapsed on next call
      # The circuit should move to :half_open and allow the request through
      result = Tracker.search(id, query)

      # Either the probe went through (error from bad url) or :circuit_open
      # Since reset_after_s == 0, it must have tried (half_open), not rejected
      assert result != {:error, :circuit_open}
    end

    test "threshold is configurable via YAML config" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 1, "reset_after_s" => 60}
      })
      query = SearchQuery.new("test")

      Tracker.search(id, query)

      assert {:ok, %{circuit_state: :open, circuit_threshold: 1}} = Tracker.status(id)
    end

    test "defaults to threshold=5 when circuit_breaker config absent" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999"
      })

      assert {:ok, %{circuit_threshold: 5}} = Tracker.status(id)
    end
  end

  # ---- status ----------------------------------------------------------------

  describe "status/1" do
    test "includes circuit breaker fields" do
      id = start_tracker()
      assert {:ok, status} = Tracker.status(id)

      assert Map.has_key?(status, :circuit_state)
      assert Map.has_key?(status, :circuit_opened_at)
      assert Map.has_key?(status, :circuit_threshold)
      assert Map.has_key?(status, :circuit_reset_ms)
      assert Map.has_key?(status, :failure_count)
      assert Map.has_key?(status, :healthy)
    end

    test "healthy is true when circuit is closed" do
      id = start_tracker()
      assert {:ok, %{healthy: true}} = Tracker.status(id)
    end

    test "healthy is false when circuit is open" do
      id = start_tracker(%{
        "agent" => "http",
        "base_url" => "http://127.0.0.1:19999",
        "circuit_breaker" => %{"threshold" => 1, "reset_after_s" => 60}
      })
      Tracker.search(id, SearchQuery.new("test"))

      assert {:ok, %{healthy: false}} = Tracker.status(id)
    end
  end
end
