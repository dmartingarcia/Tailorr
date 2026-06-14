# Tailorr — Developer Guide

## What is Tailorr?

Tailorr is a meta-indexer / tracker aggregator in the style of Jackett/Prowlarr. It exposes a unified Torznab/Newznab-compatible API that apps like Sonarr, Radarr, Lidarr, and Readarr consume. Under the hood, Tailorr fans out search requests to many configured trackers — scraping them via HTTP, headless browser, or direct API — and normalizes the results.

## Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Core app | Elixir 1.20 + Phoenix 1.8.7 | Actor model (GenServers/Supervisors) = each tracker is a supervised process; OTP fault tolerance; built-in concurrency |
| Background jobs | Oban 2.22.1 | Persistent job queue backed by Postgres |
| Database | PostgreSQL 18 (prod) / SQLite (dev) | Config, tracker state, search history |
| Cache | Cachex 4.1.1 | In-memory result cache, TTL per tracker |
| CF bypass | FlareSolverr v3.5.0 (sidecar) | Battle-tested Python service; exposes HTTP API to solve Cloudflare challenges |
| Browser automation | Playwright via `services/browser` (Node.js) | For JS-heavy sites and the Visual Tracker Builder UI |
| HTTP client | Req 0.5.17 | Modern, composable, built on Finch |
| HTML parsing | Floki 0.38.3 | CSS-selector-based, fast |
| Visual builder | Phoenix LiveView + BrowserPort | Point-and-click tracker definition UI (see docs/ui-builder.md) |
| Container | Docker + Docker Compose | Full stack in containers; Make targets for everything |

## Running locally

```bash
make dev        # start all services (hot reload)
make setup      # first-time: pull images, create DB, run migrations
make test       # run test suite
make logs       # tail all service logs
make shell      # iex -S mix inside the app container
```

See the [Makefile](Makefile) for the full list of targets.

## Project layout

```text
apps/tailorr/
  lib/tailorr/
    agents/          # Agent behaviours + implementations
      behaviour.ex   # @callback contract all agents must implement
      http.ex        # Plain HTTP agent
      cloudflare.ex  # Routes through FlareSolverr
      browser.ex     # Full Playwright automation
      api.ex         # REST/GraphQL API agent
      auth.ex        # Authenticated session agent (private trackers)
    trackers/        # Tracker registry + supervisor tree
      registry.ex
      supervisor.ex
      tracker.ex     # GenServer wrapping an agent
    scrapers/        # Parsing helpers (HTML, JSON, XML/RSS)
    api/             # Torznab + Newznab + internal REST
    cache/           # Cachex wrappers
  lib/tailorr_web/
    controllers/     # Phoenix controllers (API endpoints)
    live/            # LiveView UI (tracker config, search test)

tracker_definitions/
  public/            # YAML defs for public trackers (no login)
  private/           # YAML defs for private trackers (require auth)

services/
  flare_solver/      # FlareSolverr config + Dockerfile override

docs/
  architecture.md
  agents.md
  tracker-spec.md
  api.md
```

## Adding a new tracker

1. Create `tracker_definitions/{public|private}/my_tracker.yml`
2. Follow the schema in [docs/tracker-spec.md](docs/tracker-spec.md)
3. Pick the right agent type (see [docs/agents.md](docs/agents.md))
4. Run `make test-tracker TRACKER=my_tracker` to validate
5. If the tracker needs a Cloudflare bypass, no code change needed — just set `agent: cloudflare` in the YAML

## Key architectural decisions

- **Each tracker is a supervised GenServer** — if it crashes, it restarts without affecting others.
- **FlareSolverr is the primary CF bypass strategy** — it keeps the Elixir code clean. We call it via HTTP from the `Cloudflare` agent.
- **Result caching is per-tracker** — TTL configured in the YAML definition, defaults to 15 minutes.
- **Torznab is the primary external API** — it's what Sonarr/Radarr speak natively. Newznab is a thin compatibility layer on top.
- **YAML tracker definitions are hot-reloaded** — changes don't require a restart.

## Environment variables

See `.env.example` for required variables. Key ones:

| Variable | Description |
| --- | --- |
| `FLARESOLVERR_URL` | URL of the FlareSolverr service (default: `http://flaresolverr:8191`) |
| `SECRET_KEY_BASE` | Phoenix secret key |
| `DATABASE_URL` | Postgres connection string |
| `TAILORR_API_KEY` | API key for the Torznab/Newznab endpoint |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` |

## Testing

- `mix test` — unit tests
- `mix test --only integration` — integration tests (need Docker services running)
- `make test-tracker TRACKER=<name>` — validate a single tracker definition and run a live search
- Mocks: use `Tailorr.Agents.Mock` in tests; never hit real trackers in unit tests.
