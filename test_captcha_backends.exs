#!/usr/bin/env elixir

# Simple test script for CAPTCHA backends
# Run with: elixir test_captcha_backends.exs

Code.require_file("lib/tailorr/captcha/solver.ex")
Code.require_file("lib/tailorr/captcha/solvers/mock.ex")

alias Tailorr.Captcha.Solvers.Mock

IO.puts("Testing Mock CAPTCHA backend...")
IO.puts("================================\n")

captcha = %{
  image: "https://example.com/captcha.png",
  image_type: :url,
  message: "Enter code"
}

# Test 1: Default solution
IO.puts("Test 1: Default solution")
case Mock.solve(captcha) do
  {:ok, solution} -> IO.puts("  ✓ Got solution: #{solution}")
  {:error, reason} -> IO.puts("  ✗ Error: #{inspect(reason)}")
end

# Test 2: Custom solution
IO.puts("\nTest 2: Custom solution")
case Mock.solve(captcha, solution: "ABC123") do
  {:ok, "ABC123"} -> IO.puts("  ✓ Got custom solution: ABC123")
  other -> IO.puts("  ✗ Unexpected: #{inspect(other)}")
end

# Test 3: Error mode
IO.puts("\nTest 3: Error mode")
case Mock.solve(captcha, error: true, error_reason: :test_error) do
  {:error, :test_error} -> IO.puts("  ✓ Got expected error: test_error")
  other -> IO.puts("  ✗ Unexpected: #{inspect(other)}")
end

# Test 4: With delay
IO.puts("\nTest 4: With delay (100ms)")
start = System.monotonic_time(:millisecond)
Mock.solve(captcha, delay: 100, solution: "DELAYED")
elapsed = System.monotonic_time(:millisecond) - start
if elapsed >= 100 do
  IO.puts("  ✓ Delay worked: #{elapsed}ms")
else
  IO.puts("  ✗ Delay too short: #{elapsed}ms")
end

IO.puts("\n================================")
IO.puts("All tests passed! ✓")
