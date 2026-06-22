#!/bin/bash
set -e

# Bootstrap deps on first run (no-op once volumes are warm)
mix local.hex --force --quiet
mix local.rebar --force --quiet
mix deps.get --quiet
mix deps.compile --quiet

# Install asset npm deps (no-op once assets_node_modules volume is warm)
npm install --prefix assets --quiet

exec "$@"
