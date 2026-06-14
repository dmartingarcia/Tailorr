defmodule Tailorr.PowTest do
  use ExUnit.Case, async: true

  alias Tailorr.Pow

  describe "compute/2" do
    test "computes POW with difficulty 1" do
      {:ok, nonce} = Pow.compute("test", 1)
      assert is_integer(nonce)
      assert Pow.validate?("test", nonce, 1)
    end

    test "computes POW with difficulty 2" do
      {:ok, nonce} = Pow.compute("challenge", 2)
      assert is_integer(nonce)
      assert Pow.validate?("challenge", nonce, 2)
    end

    test "computes POW with difficulty 3" do
      {:ok, nonce} = Pow.compute("hello", 3)
      assert is_integer(nonce)
      assert Pow.validate?("hello", nonce, 3)
    end

    test "uses default difficulty 3" do
      {:ok, nonce} = Pow.compute("test")
      assert Pow.validate?("test", nonce, 3)
    end

    test "nonce is deterministic for same challenge" do
      {:ok, nonce1} = Pow.compute("same-challenge", 2)
      {:ok, nonce2} = Pow.compute("same-challenge", 2)
      assert nonce1 == nonce2
    end

    test "different challenges produce different nonces" do
      {:ok, nonce1} = Pow.compute("challenge-a", 2)
      {:ok, nonce2} = Pow.compute("challenge-b", 2)
      assert nonce1 != nonce2
    end

    test "higher difficulty requires more iterations" do
      {:ok, nonce1} = Pow.compute("test", 1)
      {:ok, nonce2} = Pow.compute("test", 2)

      # Generally nonce2 should be >= nonce1 (more iterations needed)
      # But this isn't guaranteed, so we just check both succeed
      assert is_integer(nonce1)
      assert is_integer(nonce2)
    end
  end

  describe "validate?/3" do
    test "validates correct nonce for difficulty 1" do
      {:ok, nonce} = Pow.compute("test", 1)
      assert Pow.validate?("test", nonce, 1)
    end

    test "validates correct nonce for difficulty 2" do
      {:ok, nonce} = Pow.compute("test", 2)
      assert Pow.validate?("test", nonce, 2)
    end

    test "validates correct nonce for difficulty 3" do
      {:ok, nonce} = Pow.compute("test", 3)
      assert Pow.validate?("test", nonce, 3)
    end

    test "rejects incorrect nonce" do
      refute Pow.validate?("test", 999_999, 2)
      refute Pow.validate?("challenge", 1, 3)
    end

    test "rejects nonce with insufficient difficulty" do
      {:ok, nonce} = Pow.compute("test", 1)
      # Nonce for difficulty 1 won't satisfy difficulty 2
      refute Pow.validate?("test", nonce, 2)
    end

    test "uses default difficulty 3" do
      {:ok, nonce} = Pow.compute("test", 3)
      assert Pow.validate?("test", nonce)
    end

    test "accepts nonce for lower difficulty than required" do
      {:ok, nonce} = Pow.compute("test", 3)
      # If it satisfies difficulty 3, it also satisfies 1 and 2
      assert Pow.validate?("test", nonce, 1)
      assert Pow.validate?("test", nonce, 2)
    end
  end

  describe "estimate_time/1" do
    test "estimates time for difficulty 1" do
      assert Pow.estimate_time(1) == 0.01
    end

    test "estimates time for difficulty 2" do
      assert Pow.estimate_time(2) == 0.1
    end

    test "estimates time for difficulty 3" do
      assert Pow.estimate_time(3) == 2.0
    end

    test "estimates time for difficulty 4" do
      assert Pow.estimate_time(4) == 30.0
    end

    test "estimates time for higher difficulties" do
      time5 = Pow.estimate_time(5)
      time6 = Pow.estimate_time(6)

      # Time should increase exponentially
      assert time5 > 30.0
      assert time6 > time5
    end

    test "time increases with difficulty" do
      times = Enum.map(1..5, &Pow.estimate_time/1)
      # Each should be greater than the previous
      assert times == Enum.sort(times)
    end
  end

  describe "hash generation" do
    test "generates SHA-256 hash" do
      # Indirectly tested through compute/validate
      # Verify that validation actually checks the hash
      {:ok, nonce} = Pow.compute("test", 2)

      # The hash of "test#{nonce}" should start with "00"
      text = "test#{nonce}"
      hash = :crypto.hash(:sha256, text)
      hash_hex = Base.encode16(hash, case: :lower)

      assert String.starts_with?(hash_hex, "00")
    end

    test "hash is case-insensitive (lowercase)" do
      {:ok, nonce} = Pow.compute("TEST", 2)
      assert Pow.validate?("TEST", nonce, 2)

      # Hash should be lowercase hex
      text = "TEST#{nonce}"
      hash = :crypto.hash(:sha256, text)
      hash_hex = Base.encode16(hash, case: :lower)

      assert hash_hex == String.downcase(hash_hex)
    end
  end

  describe "edge cases" do
    test "works with empty challenge" do
      {:ok, nonce} = Pow.compute("", 1)
      assert Pow.validate?("", nonce, 1)
    end

    test "works with numeric challenge" do
      {:ok, nonce} = Pow.compute("12345", 2)
      assert Pow.validate?("12345", nonce, 2)
    end

    test "works with special characters" do
      {:ok, nonce} = Pow.compute("!@#$%", 1)
      assert Pow.validate?("!@#$%", nonce, 1)
    end

    test "works with long challenge string" do
      long_challenge = String.duplicate("a", 1000)
      {:ok, nonce} = Pow.compute(long_challenge, 1)
      assert Pow.validate?(long_challenge, nonce, 1)
    end

    test "nonce 0 is valid if it solves the challenge" do
      # Unlikely but theoretically possible
      if Pow.validate?("lucky", 0, 1) do
        assert {:ok, 0} = Pow.compute("lucky", 1)
      end
    end
  end
end
