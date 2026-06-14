# Tracker Definition Spec

Tracker definitions live in `tracker_definitions/public/` (no login) or `tracker_definitions/private/` (login required). Each definition is a single YAML file named `<tracker_id>.yml`.

## Minimal example

```yaml
id: example_tracker
name: "Example Tracker"
description: "A public torrent tracker"
language: en
type: public
categories:
  - movies
  - tv

agent: http
base_url: "https://example-tracker.com"
search_path: "/search"

parsing:
  result_rows: ".results tbody tr"
  fields:
    title: "td.name a"
    size: "td.size"
    seeders: "td.seeders"
    leechers: "td.leechers"
    download_url: "td.download a@href"
    magnet_url: "td.magnet a@href"
```

## Full field reference

### Top-level metadata

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Unique snake_case identifier |
| `name` | string | yes | Human-readable tracker name |
| `description` | string | no | Short description |
| `language` | string | no | ISO 639-1 language code (default: `en`) |
| `type` | enum | yes | `public` or `private` |
| `categories` | list | no | Content types: `movies`, `tv`, `music`, `books`, `software`, `games`, `xxx`, `other` |
| `enabled` | bool | no | Default `true`; set `false` to disable without deleting |
| `notes` | string | no | Free-text notes about quirks or limitations |

### Agent selection

| Field | Type | Required | Description |
|---|---|---|---|
| `agent` | enum | yes | `http` \| `cloudflare` \| `browser` \| `api` \| `auth` |

### Agent: `http`

```yaml
agent: http
base_url: "https://tracker.com"
search_path: "/search"
headers:
  User-Agent: "Mozilla/5.0 ..."
  Referer: "https://tracker.com"
encoding: "utf-8"          # response charset
timeout_ms: 15000
retries: 2
```

### Agent: `cloudflare`

```yaml
agent: cloudflare
base_url: "https://cf-tracker.com"
search_path: "/search"
flaresolverr_url: "http://flaresolverr:8191"   # optional (uses env var)
session_ttl_minutes: 60
max_timeout_ms: 60000
```

### Agent: `browser`

```yaml
agent: browser
base_url: "https://complex-tracker.com"
search_path: "/search"
driver: flaresolverr       # or: port
wait_for_selector: ".results"
scroll_to_bottom: false
screenshot_on_error: true
max_timeout_ms: 90000
```

### Agent: `api`

```yaml
agent: api
base_url: "https://api-tracker.com"
api_key: ""                # leave empty; set via env var TRACKER_APIKEY_<ID>
api_format: torznab        # torznab | newznab | json | rss
search_path: "/api/v1/search"
method: GET
headers:
  X-Api-Key: ""            # populated from env var at runtime
response_mapping:          # only for api_format: json
  results_key: "data"
  title_key: "name"
  size_key: "size"
  seeders_key: "seeders"
  leechers_key: "leechers"
  download_url_key: "torrent_url"
  info_hash_key: "hash"
  category_key: "category"
```

### Agent: `auth` (private trackers)

```yaml
agent: auth
base_url: "https://private-tracker.com"
search_path: "/browse.php"
login_path: "/login.php"
login_method: POST
login_form:
  username_field: "username"
  password_field: "password"
  extra_fields:
    keeplogged: "1"
credentials_env:
  username: TRACKER_USERNAME   # name of the env var (not the value)
  password: TRACKER_PASSWORD
session_check:
  logged_in_selector: "#userinfo"
  # or:
  # logged_out_string: "Please login"
session_ttl_minutes: 1440
use_cloudflare: false          # set true if site also has CF protection
```

### Parsing rules

```yaml
parsing:
  result_rows: "table.results tbody tr"   # CSS selector for each result row
  fields:
    # Each value is either a CSS selector (returns text content)
    # or "selector@attribute" (returns the attribute value)
    title: "td.title a"
    title_attr: null          # optional: extract title from an attribute instead
    size: "td.size"
    size_format: bytes        # bytes | human (e.g. "1.5 GB") — default: human
    seeders: "td.se"
    leechers: "td.le"
    download_url: "td.dl a@href"
    magnet_url: "td.magnet a@href"
    info_hash: "td.hash"      # optional
    category: "td.cat img@title"  # optional
    date: "td.date@title"     # optional; parsed as ISO 8601 or relative
    description: "td.desc"    # optional
  # Post-processing
  strip_tags: true            # strip HTML tags from text fields (default: true)
  trim: true                  # trim whitespace (default: true)
```

### Caching

```yaml
cache:
  ttl_minutes: 15      # how long to cache results (default: 15)
  max_results: 100     # max results to store per query (default: 100)
```

### Rate limiting

```yaml
rate_limit:
  requests_per_minute: 30     # max requests to this tracker per minute
  delay_between_requests_ms: 1000   # min delay between requests
```

### Search parameter mapping

By default, the search query is sent as `q=<query>`. Override with:

```yaml
search_params:
  query_key: "search"    # parameter name for the search query (default: "q")
  category_key: "cat"    # parameter name for category filter
  extra_params:          # static params always added to every search request
    sort: "seeds"
    order: "desc"
```

## Selector cheat sheet

Selectors follow CSS syntax, with one extension: `selector@attr` extracts the attribute `attr` instead of text content.

```
td.name a              → text of <a> inside <td class="name">
td.dl a@href           → href attribute of <a> inside <td class="dl">
[data-hash]            → element with attribute data-hash (text content)
[data-hash]@data-hash  → value of data-hash attribute
tr:not(.header)        → <tr> elements without class "header"
.list > li:first-child → first <li> direct child of .list
```

## Testing a definition

```bash
make test-tracker TRACKER=example_tracker
```

This runs a live search with query "test" and prints the parsed results. Use it to iterate on selectors.

For interactive debugging:

```bash
make shell
# Inside iex:
config = Tailorr.Trackers.Registry.get("example_tracker")
{:ok, results} = Tailorr.Agents.Http.search(config, %Tailorr.SearchQuery{query: "test"})
IO.inspect(results)
```
