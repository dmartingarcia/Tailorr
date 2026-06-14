# Tailorr — Developer Guide

## What is Tailorr?

Tailorr is a meta-indexer / tracker aggregator in the style of Jackett/Prowlarr. It exposes a unified Torznab/Newznab-compatible API that apps like Sonarr, Radarr, Lidarr, and Readarr consume. Under the hood, Tailorr fans out search requests to many configured trackers — scraping them via HTTP, headless browser, or direct API — and normalizes the results.

## Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Core app | Elixir 1.20 + Phoenix 1.7.23 | Actor model (GenServers/Supervisors) = each tracker is a supervised process; OTP fault tolerance; built-in concurrency |
| Web UI | Phoenix LiveView 1.0.18 + Salad UI 0.14.9 | Real-time reactive UIs with server-rendered HTML; Salad UI provides shadcn-inspired components |
| Background jobs | Oban 2.23.0 | Persistent job queue backed by Postgres |
| Database | PostgreSQL 18 (prod) / SQLite (dev) | Config, tracker state, search history |
| Cache | Cachex 4.1.1 | In-memory result cache, TTL per tracker |
| CF bypass | FlareSolverr v3.5.0 (sidecar) | Battle-tested Python service; exposes HTTP API to solve Cloudflare challenges |
| Browser automation | Playwright via `services/browser` (Node.js) | For JS-heavy sites and the Visual Tracker Builder UI; GenServer bridge for Elixir integration |
| HTTP client | Req 0.5.18 | Modern, composable, built on Finch |
| HTML parsing | Floki 0.38.3 | CSS-selector-based, fast |
| HTTP Server | Bandit 1.12.0 | Pure Elixir HTTP/1.1 and HTTP/2 server, faster than Cowboy |
| Container | Docker + Docker Compose | Full stack in containers; Make targets for everything |

## Running locally

```bash
# Local development (without Docker)
make dev              # start Phoenix server
make browser          # start browser service (requires Node.js)
mix phx.server        # alternative: start Phoenix directly

# Docker development
make dev DOCKER=1     # start all services in containers
make browser DOCKER=1 # start browser service in container
make dev-all DOCKER=1 # start Phoenix + browser + all dependencies

# First-time setup
make setup            # pull images, create DB, run migrations
make setup DOCKER=1   # setup with Docker

# Other commands
make test             # run test suite
make test DOCKER=1    # run tests in Docker
make logs             # tail all service logs (Docker only)
make shell            # iex -S mix (local or Docker depending on DOCKER flag)
```

See the [Makefile](Makefile) for the full list of targets. All targets support `DOCKER=0` (local, default) or `DOCKER=1` (containerized).

## Web UIs

Tailorr provides two LiveView UIs for tracker management:

### Test UI (http://localhost:4000 or http://localhost:4000/ui/test)

Search testing interface similar to Jackett's manual search:
- Select tracker(s) from dropdown (individual or "All trackers")
- Enter search query
- View results in real-time as they arrive
- See title, size, seeders, peers, download links
- Test tracker configurations before using with Sonarr/Radarr

### Tracker Builder (http://localhost:4000/ui/builder)

Visual point-and-click tracker definition creator:
- Enter tracker search URL
- Browser screenshot loads in real-time via Playwright
- Click on page elements to extract CSS selectors
- Map selectors to fields (title, size, seeders, download link, etc.)
- Live YAML preview updates as you work
- Test parsing with live results
- Save YAML definition to `tracker_definitions/`

**How it works:**
1. `services/browser` runs Node.js + Playwright, exposes HTTP API
2. `Tailorr.Browser.Port` GenServer bridges Elixir ↔ Node.js
3. LiveView streams screenshots and click events
4. `Tailorr.Builder` generates YAML from extracted selectors
5. Follows strict SOLID principles (SRP, DIP, ISP, etc.)

## Project layout

**Note: This is a single-app Phoenix project, NOT an umbrella app.**

```text
lib/
  tailorr/               # Core business logic
    agents/              # Agent behaviours + implementations
      behaviour.ex       # @callback contract all agents must implement
      http.ex            # Plain HTTP agent
      cloudflare.ex      # Routes through FlareSolverr
      browser.ex         # Full Playwright automation
      api.ex             # REST/GraphQL API agent
      auth.ex            # Authenticated session agent (private trackers)
    trackers/            # Tracker registry + supervisor tree
      registry.ex
      supervisor.ex
      tracker.ex         # GenServer wrapping an agent
    browser/             # Browser service integration
      port.ex            # GenServer bridge to Node.js Playwright service
      session.ex         # Browser session struct
    builder/             # Tracker builder business logic
      yaml_generator.ex  # Generate YAML from selectors
      validator.ex       # Validate tracker definitions
    captcha/             # CAPTCHA solving system
      solvers/           # OCR, ML, Telegram, Mock backends
      smart_solver.ex    # Cascade strategy across backends
    scrapers/            # Parsing helpers (HTML, JSON, XML/RSS)
    cache/               # Cachex wrappers
    application.ex       # OTP Application with full supervision tree
    
  tailorr_web/           # Phoenix web layer
    controllers/         # Phoenix controllers (Torznab API)
    live/                # LiveView UIs
      tracker_test/      # Search testing UI (like Jackett)
        test_live.ex
      tracker_builder/   # Visual tracker definition builder
        builder_live.ex
      captcha_review/    # CAPTCHA review/training UI
    components/          # Reusable Phoenix components
      core_components.ex # Salad UI imports + custom components
      layouts.ex         # Root and app layouts
    endpoint.ex          # Phoenix Endpoint
    router.ex            # Route definitions
    gettext.ex           # Internationalization

assets/                  # Frontend assets
  css/
    app.css              # Tailwind + Salad UI styles
  js/
    app.js               # Phoenix LiveView hooks
  tailwind.config.js     # Tailwind configuration

tracker_definitions/
  public/                # YAML defs for public trackers (no login)
  private/               # YAML defs for private trackers (require auth)

services/
  browser/               # Node.js + Playwright service
    server.js            # Express API for browser automation
    package.json
    Dockerfile
  flare_solver/          # FlareSolverr config + Dockerfile override

config/
  config.exs             # Base configuration
  dev.exs                # Development config
  test.exs               # Test config
  runtime.exs            # Runtime config (reads env vars)

priv/
  repo/
    migrations/          # Ecto migrations
  static/                # Compiled assets (generated)

docs/
  architecture.md
  agents.md
  tracker-spec.md
  api.md
  captcha.md             # CAPTCHA system documentation
```

## Adding a new tracker

1. Create `tracker_definitions/{public|private}/my_tracker.yml`
2. Follow the schema in [docs/tracker-spec.md](docs/tracker-spec.md)
3. Pick the right agent type (see [docs/agents.md](docs/agents.md))
4. Run `make test-tracker TRACKER=my_tracker` to validate
5. If the tracker needs a Cloudflare bypass, no code change needed — just set `agent: cloudflare` in the YAML

## Key architectural decisions

- **Single-app structure (NOT umbrella)** — Simpler dependency management, easier testing, clearer boundaries. All code in `lib/tailorr/` (business logic) and `lib/tailorr_web/` (web layer).
- **Each tracker is a supervised GenServer** — if it crashes, it restarts without affecting others.
- **SOLID principles enforced throughout**:
  - **SRP**: Contexts separated by responsibility (Browser, Builder, Trackers, Captcha)
  - **OCP**: Components use slots for extension, behaviours for polymorphism
  - **LSP**: All agent implementations honor `Tailorr.Agents.Behaviour` contract
  - **ISP**: Narrow, focused public APIs (no fat contexts)
  - **DIP**: Compile-time dependency injection via `Application.compile_env/3` for testability
- **FlareSolverr is the primary CF bypass strategy** — it keeps the Elixir code clean. We call it via HTTP from the `Cloudflare` agent.
- **Browser automation via GenServer bridge** — `Tailorr.Browser.Port` manages HTTP communication with Node.js Playwright service; no direct NIF dependencies.
- **Result caching is per-tracker** — TTL configured in the YAML definition, defaults to 15 minutes.
- **Torznab is the primary external API** — it's what Sonarr/Radarr speak natively. Newznab is a thin compatibility layer on top.
- **YAML tracker definitions are hot-reloaded** — changes don't require a restart.
- **LiveView for all UIs** — No separate frontend framework needed; server-rendered HTML with WebSocket updates; Salad UI for consistent component library.

## Environment variables

See `.env.example` for required variables. Key ones:

| Variable | Description |
| --- | --- |
| `FLARESOLVERR_URL` | URL of the FlareSolverr service (default: `http://flaresolverr:8191`) |
| `BROWSER_URL` | URL of the Playwright browser service (default: `http://localhost:3001`) |
| `SECRET_KEY_BASE` | Phoenix secret key (generate with `mix phx.gen.secret`) |
| `DATABASE_URL` | Postgres connection string (dev uses SQLite by default) |
| `TAILORR_API_KEY` | API key for the Torznab/Newznab endpoint |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` |
| `PHX_HOST` | Phoenix host (default: `localhost`) |
| `PORT` | Phoenix HTTP port (default: `4000`) |

## Testing

- `mix test` — unit tests
- `mix test --only integration` — integration tests (need Docker services running)
- `make test-tracker TRACKER=<name>` — validate a single tracker definition and run a live search
- `make test-coverage` — run tests with coverage report in console
- `make test-coverage-html` — generate HTML coverage report (opens `cover/excoveralls.html`)
- Mocks: use `Tailorr.Agents.Mock` in tests; never hit real trackers in unit tests.
