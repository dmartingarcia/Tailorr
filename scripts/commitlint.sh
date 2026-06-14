#!/usr/bin/env bash
# Validates commit message against Conventional Commits spec.
set -euo pipefail

MSG=$(cat "$1")

# Strip comments (lines starting with #)
MSG=$(echo "$MSG" | grep -v '^#' | head -1)

PATTERN='^(feat|fix|docs|chore|refactor|test|ci|style|perf|build|revert)(\(.+\))!?: .{1,72}$'

if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo ""
  echo "  ✗ Invalid commit message: \"$MSG\""
  echo ""
  echo "  Expected format:  type(scope): description"
  echo "  Example:          feat(agents): add cloudflare bypass"
  echo ""
  echo "  Allowed types: feat fix docs chore refactor test ci style perf build revert"
  echo "  Scope is optional. Add ! before : for breaking changes."
  echo ""
  exit 1
fi
