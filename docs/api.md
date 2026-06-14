# Tailorr API Documentation

## Torznab API

Tailorr implements the Torznab API specification, compatible with Sonarr, Radarr, Lidarr, and other *arr applications.

### Base URL

```
http://localhost:4000/api
```

### Authentication

API key required via query parameter or header:
- Query: `?apikey=YOUR_KEY`
- Header: `X-API-Key: YOUR_KEY`

**Configuration:** Set API keys in `config/runtime.exs`:
```elixir
config :tailorr, :api_keys, ["your-secret-key-here"]
```

Or via environment variable:
```bash
export TAILORR_API_KEYS=key1,key2,key3
```

Leave empty (`[]`) to disable authentication (development only).

---

## Endpoints

### 1. Search

Search across configured trackers.

**Request:**
```
GET /api?t=search&q=<query>&apikey=<key>[&tracker=<ids>][&limit=<n>]
```

**Parameters:**

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `t` | Yes | Action type | `search` |
| `q` | Yes | Search query | `matrix` |
| `apikey` | Yes | API key | `abc123` |
| `tracker` | No | Comma-separated tracker IDs. Omit for all enabled trackers | `dontorrent` or `dontorrent,mejortorrent` |
| `limit` | No | Max results (default: 100) | `50` |
| `cat` | No | Category filter (TODO) | `5000` |

**Response:** Torznab XML (RSS 2.0 + torznab namespace)

**Examples:**

```bash
# Search all enabled trackers
curl "http://localhost:4000/api?t=search&q=matrix&apikey=YOUR_KEY"

# Search specific tracker
curl "http://localhost:4000/api?t=search&q=matrix&tracker=dontorrent&apikey=YOUR_KEY"

# Search multiple trackers with limit
curl "http://localhost:4000/api?t=search&q=matrix&tracker=dontorrent,mejortorrent&limit=50&apikey=YOUR_KEY"
```

**Response Format:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:torznab="http://torznab.com/schemas/2015/feed">
  <channel>
    <title>Tailorr</title>
    <description>Tailorr Meta-Indexer Search Results</description>
    <torznab:response offset="0" total="10"/>
    <item>
      <title>Matrix [4K]</title>
      <guid>dontorrent-12345</guid>
      <link>https://9386-don.mirror.pm/torrents/peliculas/matrix-4k.torrent</link>
      <enclosure url="https://9386-don.mirror.pm/torrents/peliculas/matrix-4k.torrent" type="application/x-bittorrent"/>
      <torznab:attr name="size" value="15728640000"/>
      <torznab:attr name="quality" value="4K"/>
      <torznab:attr name="category" value="Película"/>
      <torznab:attr name="indexer" value="dontorrent"/>
    </item>
    <!-- more items -->
  </channel>
</rss>
```

---

### 2. Capabilities

Get indexer capabilities.

**Request:**
```
GET /api?t=caps&apikey=<key>
```

**Response:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<caps>
  <server title="Tailorr" version="1.0"/>
  <searching>
    <search available="yes" supportedParams="q"/>
  </searching>
</caps>
```

---

## Sonarr/Radarr Configuration

**Add Tailorr as an indexer:**

1. Settings → Indexers → Add → Torznab → Custom
2. **Name:** Tailorr
3. **URL:** `http://localhost:4000/api`
4. **API Key:** Your configured API key
5. **Categories:** (leave default or customize)
6. Test → Save

---

## Available Trackers

| ID | Name | Status | Agent | Notes |
|----|------|--------|-------|-------|
| `dontorrent` | DonTorrent | ✅ Enabled | HTTP + POW | Proof-of-work protection bypassed |
| `mejortorrent` | MejorTorrent | ❌ Disabled | HTTP | Cloudflare protected (403) |
| `elitetorrent` | EliteTorrent | ❌ Disabled | HTTP | Domain unreachable |

**Enable/disable trackers:** Edit YAML files in `tracker_definitions/public/`

---

## Error Responses

**Invalid API Key:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<error code="200" description="Invalid or missing API key"/>
```

**Missing Query:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<error code="200" description="Missing 'q' parameter"/>
```

---

## Rate Limits

**DonTorrent:**
- 60 downloads/hour (enforced by tracker)
- CAPTCHA challenges for soft limits (automatically solved via configured backend)
- Proof-of-work computation: ~2-5 seconds per result

**Global:**
- No rate limits enforced by Tailorr itself
- Respect individual tracker limits (configured in YAML)

---

## Development

**Test endpoint:**
```bash
mix tailorr.test_tracker dontorrent "matrix"
```

**Start server:**
```bash
iex -S mix phx.server
```

**API endpoint:**
```bash
curl "http://localhost:4000/api?t=search&q=test&apikey=dev"
```
