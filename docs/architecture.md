# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        External Clients                      │
│           Sonarr / Radarr / Lidarr / Readarr / UI           │
└──────────────────────────┬──────────────────────────────────┘
                           │ Torznab / Newznab / REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tailorr (Elixir/Phoenix)                  │
│                                                              │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │  Phoenix API │    │        Tracker Supervisor         │   │
│  │  (Torznab,   │───▶│                                  │   │
│  │   Newznab,   │    │  ┌──────────┐  ┌──────────┐      │   │
│  │   REST UI)   │    │  │ Tracker  │  │ Tracker  │ ...  │   │
│  └──────────────┘    │  │ GenServer│  │ GenServer│      │   │
│                      │  └────┬─────┘  └────┬─────┘      │   │
│  ┌──────────────┐    │       │              │            │   │
│  │    Cachex    │    └───────┼──────────────┼────────────┘   │
│  │  (per-tracker│            │              │                │
│  │    TTL)      │◀───────────┴──────────────┘                │
│  └──────────────┘            │                               │
│                              ▼                               │
│             ┌────────────────────────────┐                   │
│             │         Agent Layer         │                   │
│             │                            │                   │
│             │  HttpAgent  CloudflareAgent │                   │
│             │  BrowserAgent   ApiAgent    │                   │
│             │  AuthAgent                 │                   │
│             └──────────┬─────────────────┘                   │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌─────────────┐  ┌──────────────┐
    │ Tracker  │  │FlareSolverr │  │   Tracker    │
    │ HTTP/S   │  │  (sidecar)  │  │  Direct API  │
    └──────────┘  └─────────────┘  └──────────────┘
```

## Components

### Phoenix API

Handles incoming search requests from \*arr apps and the web UI. Validates the API key, decodes the Torznab/Newznab query parameters, and dispatches the search to the Tracker Supervisor.

Endpoints:
- `GET /torznab` — Torznab API (primary)
- `GET /newznab` — Newznab compatibility layer
- `GET /api/trackers` — list configured trackers
- `GET /ui` — LiveView web interface

### Tracker Supervisor

An OTP Supervisor that owns one `Tracker.GenServer` per configured tracker. Uses a `DynamicSupervisor` so trackers can be added/removed at runtime without restart.

When a tracker definition YAML changes on disk, the supervisor is notified (via `FileSystem` watcher) and hot-reloads the affected tracker.

### Tracker.GenServer

Each tracker runs as its own supervised process. Responsibilities:
- Hold tracker config (parsed from YAML)
- Own its agent instance
- Rate limit outgoing requests (token bucket)
- Report health / last-success metrics

### Agent Layer

The agents do the actual work of fetching and parsing tracker pages. Each agent implements the `Tailorr.Agents.Behaviour` contract:

```elixir
@callback search(config :: map(), query :: SearchQuery.t()) ::
  {:ok, [Result.t()]} | {:error, reason :: term()}

@callback test_connection(config :: map()) ::
  :ok | {:error, reason :: term()}
```

See [agents.md](agents.md) for each agent type.

### Cachex

Results are cached in-memory with a per-tracker TTL (default 15 min, configurable in YAML). Cache key = `{tracker_id, query_hash}`. On cache miss, the request is forwarded to the agent. On hit, results are returned immediately.

### FlareSolverr

A separate Python/Playwright service that accepts an HTTP POST with a URL and returns the rendered page content along with solved cookies. The `CloudflareAgent` calls this service and then injects the `cf_clearance` cookie into subsequent direct HTTP requests.

```
POST http://flaresolverr:8191/v1
{
  "cmd": "request.get",
  "url": "https://tracker-with-cf.com/search?q=...",
  "maxTimeout": 60000
}
```

## Request flow (search)

1. Sonarr calls `GET /torznab?t=search&q=Breaking+Bad&apikey=...`
2. Phoenix validates the API key, parses query params
3. Phoenix calls `TrackerSupervisor.search_all(query)` which fans out to all enabled trackers
4. Each `Tracker.GenServer` checks Cachex → hit returns immediately
5. On cache miss, the GenServer calls its agent's `search/2`
6. Agent fetches the tracker page (via HTTP, CF bypass, or browser)
7. Agent parses HTML/JSON into `[Result.t()]`
8. Results cached, returned up the chain
9. Phoenix aggregates, deduplicates, and serializes to Torznab XML
10. Sonarr receives the response

## Fault isolation

- If a tracker's GenServer crashes, its supervisor restarts it (exponential backoff)
- Other trackers are unaffected
- A tracker that fails repeatedly is automatically disabled and marked unhealthy
- FlareSolverr crashes don't affect HTTP-only or API trackers

## Scaling

For a single-user home server, a single Docker Compose node is sufficient. For multi-user or high-volume scenarios:
- Oban workers can be distributed across multiple Elixir nodes
- Cachex can be replaced with Redis-backed Nebulex
- FlareSolverr can be load-balanced across multiple instances
