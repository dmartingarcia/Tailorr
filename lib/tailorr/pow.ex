defmodule Tailorr.Pow do
  @moduledoc """
  Proof-of-Work implementation for DonTorrent download protection.

  Computes SHA-256 hashes to find a nonce that satisfies the difficulty requirement.
  """

  @doc """
  Compute proof-of-work for a given challenge and difficulty.

  ## Parameters
    - challenge: String challenge from the server
    - difficulty: Number of leading zeros required (default: 3)

  ## Returns
    - {:ok, nonce} when solution is found
    - {:error, :timeout} if max iterations exceeded

  ## Examples

      iex> Pow.compute("challenge123", 2)
      {:ok, 42}

  """
  def compute(challenge, difficulty \\ 3) do
    target = String.duplicate("0", difficulty)
    # Safety limit
    max_iterations = 10_000_000

    compute_loop(challenge, target, 0, max_iterations)
  end

  defp compute_loop(_challenge, _target, nonce, max_iterations) when nonce >= max_iterations do
    {:error, :timeout}
  end

  defp compute_loop(challenge, target, nonce, max_iterations) do
    text = "#{challenge}#{nonce}"
    hash = :crypto.hash(:sha256, text)
    hash_hex = Base.encode16(hash, case: :lower)

    if String.starts_with?(hash_hex, target) do
      {:ok, nonce}
    else
      compute_loop(challenge, target, nonce + 1, max_iterations)
    end
  end

  @doc """
  Validate that a nonce solves the challenge with the given difficulty.

  Useful for testing or verifying server responses.
  """
  def validate?(challenge, nonce, difficulty \\ 3) do
    target = String.duplicate("0", difficulty)
    text = "#{challenge}#{nonce}"
    hash = :crypto.hash(:sha256, text)
    hash_hex = Base.encode16(hash, case: :lower)

    String.starts_with?(hash_hex, target)
  end

  @doc """
  Estimate time to compute POW based on difficulty.
  Returns approximate seconds.
  """
  def estimate_time(difficulty) do
    # Rough estimates based on SHA-256 performance
    # difficulty=1: ~0.01s, difficulty=2: ~0.1s, difficulty=3: ~1-5s
    case difficulty do
      1 -> 0.01
      2 -> 0.1
      3 -> 2.0
      4 -> 30.0
      n -> :math.pow(16, n - 3) * 2.0
    end
  end
end
