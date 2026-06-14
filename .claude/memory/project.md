---
name: tailorr-project-overview
description: Core goals, stack decisions, and scope for the Tailorr project
metadata:
  type: project
---

Tailorr is a self-hosted meta-indexer / tracker aggregator (Jackett/Prowlarr-style) that exposes a unified Torznab/Newznab API for *arr apps.

**Why:** Stack chosen for first-class concurrency (OTP actor model) and fault tolerance — each tracker runs as a supervised GenServer; if one crashes it doesn't affect others.

**Tech stack:**
- Core: Elixir + Phoenix
- Jobs: Oban
- Cache: Cachex (in-memory, per-tracker TTL)
- HTTP client: Req
- HTML parsing: Floki
- DB: PostgreSQL (prod) / SQLite (dev)
- CF bypass: FlareSolverr sidecar (Python/Playwright, HTTP API)
- Container: Docker Compose + Make (all dev actions via `make`)

**Five agent types in the application:**
1. `http` — plain HTTP scraping
2. `cloudflare` — CF-protected sites via FlareSolverr
3. `browser` — full Playwright (via FlareSolverr or a Node.js port)
4. `api` — structured REST/JSON/XML/Torznab API
5. `auth` — private trackers requiring login (credentials via env vars only)

**Five Claude Code agents for development** (in `.claude/agents/`):
- `tracker-definer` — writing/debugging YAML tracker definitions
- `elixir-dev` — Elixir/Phoenix application code
- `scraper-debugger` — diagnosing broken scrapers, selector issues
- `infra` — Docker, Makefile, CI, environment
- `reviewer` — code review for correctness, security, OTP patterns

**How to apply:** When starting any dev task on Tailorr, pick the right Claude Code agent. All developer actions go through `make` targets — never raw docker commands in docs.
