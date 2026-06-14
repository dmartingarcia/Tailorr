# Tailorr

A self-hosted meta-indexer and tracker aggregator. Exposes a unified **Torznab/Newznab** API so that Sonarr, Radarr, Lidarr, and similar apps can search across hundreds of public and private torrent trackers from a single endpoint.

> Think Jackett/Prowlarr, but built on Elixir for better concurrency and fault tolerance, with first-class support for Cloudflare-protected sites and JS-challenge trackers.

## Features

- Unified Torznab/Newznab API compatible with \*arr apps
- Support for public trackers (no login required)
- Support for private trackers (session/cookie management)
- Cloudflare and JavaScript challenge bypass via FlareSolverr
- Full browser automation for complex sites
- Hot-reloadable YAML tracker definitions
- Built-in result caching per tracker
- Web UI for tracker configuration and search testing
- Docker Compose for zero-effort deployment

## Quick start

```bash
# 1. Clone
git clone https://github.com/youruser/tailorr
cd tailorr

# 2. Configure
cp .env.example .env
# Edit .env as needed

# 3. Start
make setup   # first run only
make dev
```

The API will be available at `http://localhost:4000` and the web UI at `http://localhost:4000/ui`.

## Adding to Sonarr / Radarr

1. In Sonarr/Radarr go to Settings → Indexers → Add → Torznab
2. URL: `http://your-tailorr-host:4000/torznab`
3. API Key: value from your `.env` (`TAILORR_API_KEY`)

## Supported tracker types

| Type | Description |
|---|---|
| HTTP | Plain HTTP scraping with custom headers and cookies |
| Cloudflare | CF-protected sites via FlareSolverr |
| Browser | Full headless browser (Playwright) for JS-heavy sites |
| API | Trackers with a public or private JSON/XML API |
| Authenticated | Private trackers requiring login (credentials stored encrypted) |

## Documentation

- [Architecture](docs/architecture.md)
- [Agent types](docs/agents.md)
- [Tracker definition spec](docs/tracker-spec.md)
- [API reference](docs/api.md)
- [Developer guide](CLAUDE.md)

## Requirements

- Docker + Docker Compose
- Make

## License

MIT
