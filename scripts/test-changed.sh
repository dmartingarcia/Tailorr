#!/usr/bin/env bash
# Runs mix test only for test files that correspond to the changed lib files.
# Exits 0 (success) if no matching test files are found — skips silently.
set -euo pipefail

TEST_FILES=()

for src in "$@"; do
  # Only consider files under apps/tailorr/lib/
  [[ "$src" == apps/tailorr/lib/*.ex ]] || [[ "$src" == apps/tailorr/lib/**/*.ex ]] || continue

  # Map lib/tailorr/foo/bar.ex → test/tailorr/foo/bar_test.exs
  test_file="${src/apps\/tailorr\/lib\//apps\/tailorr\/test\/}"
  test_file="${test_file%.ex}_test.exs"

  if [[ -f "$test_file" ]]; then
    TEST_FILES+=("$test_file")
  fi
done

if [[ ${#TEST_FILES[@]} -eq 0 ]]; then
  echo "  (no matching test files for changed sources — skipping)"
  exit 0
fi

echo "  Running tests for: ${TEST_FILES[*]}"
mix test "${TEST_FILES[@]}"
