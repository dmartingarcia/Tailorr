---
name: tailorr-dev-feedback
description: Agreed conventions and things to avoid during Tailorr development
metadata:
  type: feedback
---

**Elixir skeleton via command, not manual files.**
Run `mix phx.new` inside a Docker container — never hand-write mix.exs or the boilerplate.
**Why:** Avoids drift from what Phoenix generates; keeps the project idiomatic.
**How to apply:** `docker run --user $(id -u):$(id -g) -v $(pwd):/app elixir:1.20-alpine mix phx.new /app/apps/tailorr --no-install`

**All developer actions through `make` targets.**
No raw `docker compose` commands in docs or instructions.
**Why:** Consistent DX across machines; new contributors only need Docker + Make.
**How to apply:** Any new operation needs a Makefile target before it's documented.

**Credentials via env vars only — never in YAML tracker definitions.**
Use `credentials_env:` block pointing to env var names.
**Why:** Prevents accidental credential commits; supports multiple deployment environments.

**Before any commit, always run `make format && make lint && make test` in that order.**
All three must pass — no exceptions. `make format` first to avoid lint failing on style; never skip or bypass.
**Why:** User requirement; keeps CI green and avoids pointless failed commits.
**How to apply:** Use the `test-runner` agent for this; it enforces the sequence automatically.

**Never add Co-Authored-By to commits.**
**Why:** User preference — keep commit messages clean.
**How to apply:** Never append Co-Authored-By lines to any git commit message.

**Multiple short commits over one big commit.**
One-liner commit messages, one logical unit per commit.
**Why:** User preference — easier to review and bisect.

**Project-level memory lives in `.claude/memory/` (committed to git).**
Not in `~/.claude/` — the project is worked on from multiple computers.
**Why:** Shared context across all contributors and machines.
**How to apply:** When saving project/feedback memories, write to `.claude/memory/`, not the user-level path.
