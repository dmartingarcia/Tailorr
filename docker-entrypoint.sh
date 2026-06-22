#!/bin/bash
set -e

# Bootstrap deps on first run (no-op once _build is warm)
mix local.hex --force --quiet
mix local.rebar --force --quiet
mix deps.get --quiet
mix deps.compile --quiet

exec "$@"
