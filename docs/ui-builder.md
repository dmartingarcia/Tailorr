# Visual Tracker Builder

The Visual Tracker Builder is a LiveView UI feature that lets anyone create or debug a tracker definition by pointing and clicking on elements in a live browser view — no code or CSS knowledge required.

## Concept

```
┌─────────────────────────────────────────────────────────────────┐
│  Tailorr UI — Tracker Builder                                    │
├──────────────────────────┬──────────────────────────────────────┤
│  Controls                │  Live browser preview                │
│                          │                                      │
│  URL: [tracker.com/s?q=] │  ┌────────────────────────────────┐ │
│  [Load page]             │  │                                │ │
│                          │  │   (rendered tracker page)      │ │
│  Field mapping:          │  │                                │ │
│  Title    [click to set] │  │  ┌──────────────────────────┐  │ │
│  Size     [click to set] │  │  │ [Title]   [Size] [Seeds] │  │ │
│  Seeders  [click to set] │  │  │ Breaking Bad    1.2GB  5  │←─┼─┼── click → "title selected"
│  Leechers [click to set] │  │  │ Game of Throne  4.1GB  12 │  │ │
│  Download [click to set] │  │  └──────────────────────────┘  │ │
│  Magnet   [click to set] │  │                                │ │
│                          │  └────────────────────────────────┘ │
│  [Test parse] [Save YAML]│                                      │
│                          │  Parsed results preview:            │
│  Generated YAML:         │  ┌────────────────────────────────┐ │
│  ┌──────────────────┐    │  │ 1. Breaking Bad S01E01         │ │
│  │ id: my_tracker   │    │  │    Size: 1.2 GB  Seeds: 5      │ │
│  │ agent: http      │    │  │    ✓ magnet link found         │ │
│  │ parsing:         │    │  └────────────────────────────────┘ │
│  │   result_rows:.. │    │                                      │
│  └──────────────────┘    │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

## How it works

### Backend: Playwright via Erlang Port

A Node.js process (managed as an Erlang Port) runs a Playwright browser. The LiveView sends commands and receives:
- **Screenshots** — rendered as `<img>` in the LiveView for the browser preview
- **Click coordinates** — translated to CSS selectors via `page.evaluate()`
- **HTML snapshots** — for Floki-based parsing on the Elixir side

```
LiveView (Elixir)  ←→  BrowserPort (Node.js + Playwright)
    send({navigate, url})       ──▶  browser.goto(url)
    send({click, x, y})         ──▶  get selector at coordinates
    receive({selector, "td.name a"}) ←── return CSS selector
    receive({screenshot, <<binary>>}) ←── PNG screenshot
```

### Frontend: click-to-select

1. User enters tracker URL + search query, clicks "Load page"
2. Playwright navigates and returns a screenshot
3. Screenshot is shown as a full-size image overlaid with a transparent click-capture div
4. User selects a field from the panel (e.g. "Title"), then clicks on the title element in the screenshot
5. LiveView sends the click coordinates to the BrowserPort
6. BrowserPort returns the CSS selector of the clicked element (using CDP's `DOM.getNodeForLocation`)
7. UI highlights the element in the screenshot and shows the generated selector
8. Repeat for each field
9. "Test parse" fetches a second page and runs the selectors — shows live results
10. "Save YAML" writes the tracker definition file and hot-reloads the tracker

### Cloudflare / challenge detection

If the page returns a Cloudflare challenge:
- UI shows a warning: "This site uses Cloudflare — switching to CF agent"
- Builder automatically sets `agent: cloudflare` in the generated YAML
- The page is re-fetched via FlareSolverr before displaying the screenshot

## Implementation plan

### Phase 1: Basic builder (HTTP-only)

- LiveView page at `/ui/builder`
- BrowserPort GenServer wrapping a Node.js/Playwright process
- Screenshot streaming via LiveView `push_event`
- Click → selector translation
- YAML generation + live preview
- "Test parse" with Floki + real selectors

### Phase 2: CF / browser support

- Auto-detect Cloudflare challenge in page response
- Route through FlareSolverr for CF sites
- Display warning in UI

### Phase 3: Auth tracker support

- Login form detection (shows login fields in UI)
- Credential input in builder (stored in session, never in YAML — env var instruction shown)
- Test search after login

### Phase 4: Multi-step / JS sites

- Step recording: "click next page", "wait for element", "scroll down"
- Export recorded steps to `browser` agent YAML

## BrowserPort Node.js service

Located at `services/browser/`. A minimal Express + Playwright server:

```
POST /navigate    { url }              → { screenshot: base64, title, status }
POST /click       { x, y, screenshot } → { selector, element_text }
POST /extract     { selector, html }   → { matches: [...] }
POST /solve_cf    { url }             → { screenshot, cookies, html }
```

Runs in Docker alongside the main app. The Elixir `BrowserPort` module communicates with it via HTTP (simpler than a raw Erlang Port for this use case).

## Tracker definition flow (for the scraper-debugger agent)

When debugging an existing tracker, the builder can be pre-loaded with the existing YAML:

```
GET /ui/builder?tracker=nyaa
```

This loads the current selectors, runs a live search, and highlights all the matched elements — making it easy to spot which selectors broke after a site redesign.
