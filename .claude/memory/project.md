---
name: tailorr-project-overview
description: Core goals, stack decisions, and scope for the Tailorr project
metadata:
  type: project
---

Tailorr is a self-hosted meta-indexer / tracker aggregator (Jackett/Prowlarr-style) that exposes a unified Torznab/Newznab API for *arr apps.

**Why:** Stack chosen for first-class concurrency (OTP actor model) and fault tolerance — each tracker runs as a supervised GenServer; if one crashes it doesn't affect others.

**CRITICAL: This is a single-app Phoenix project, NOT an umbrella app.**
User explicitly rejected umbrella structure. All code lives in:
- `lib/tailorr/` — Core business logic (agents, trackers, contexts)
- `lib/tailorr_web/` — Phoenix web layer (LiveView, controllers, endpoints)

**Tech stack:**
- Core: Elixir 1.20 + Phoenix 1.7.23
- UI: Phoenix LiveView 1.0.18 + Salad UI 0.14.9 (shadcn-inspired components)
- HTTP Server: Bandit 1.12.0 (faster than Cowboy)
- Jobs: Oban 2.23.0
- Cache: Cachex 4.1.1 (in-memory, per-tracker TTL)
- HTTP client: Req 0.5.18
- HTML parsing: Floki 0.38.3
- DB: PostgreSQL 18 (prod) / SQLite (dev)
- CF bypass: FlareSolverr sidecar (Python/Playwright, HTTP API)
- Browser automation: Node.js + Playwright service (`services/browser/`)
- Container: Docker Compose + Make (all dev actions via `make`)

**Five agent types in the application:**
1. `http` — plain HTTP scraping
2. `cloudflare` — CF-protected sites via FlareSolverr
3. `browser` — full Playwright via Node.js service (`services/browser/`)
4. `api` — structured REST/JSON/XML/Torznab API
5. `auth` — private trackers requiring login (credentials via env vars only)

**Two LiveView UIs:**
1. **Test UI** (`/` or `/ui/test`) — Search testing interface like Jackett's manual search
2. **Tracker Builder** (`/ui/builder`) — Visual point-and-click selector extraction with live screenshots

**Five Claude Code agents for development** (in `.claude/agents/`):
- `tracker-definer` — writing/debugging YAML tracker definitions
- `elixir-dev` — Elixir/Phoenix application code
- `scraper-debugger` — diagnosing broken scrapers, selector issues
- `infra` — Docker, Makefile, CI, environment
- `reviewer` — code review for correctness, security, OTP patterns

**SOLID principles enforced throughout:**
- SRP: Contexts separated by responsibility (Browser, Builder, Trackers, Captcha)
- OCP: Components use slots, behaviours for polymorphism
- LSP: All agents honor `Tailorr.Agents.Behaviour` contract
- ISP: Narrow, focused public APIs (no fat contexts)
- DIP: Compile-time dependency injection via `Application.compile_env/3`

**How to apply:** When starting any dev task on Tailorr, pick the right Claude Code agent. All developer actions go through `make` targets — never raw docker commands in docs. Always maintain SOLID principles and single-app structure.
