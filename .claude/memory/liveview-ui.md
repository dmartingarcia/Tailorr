---
name: tailorr-liveview-ui-implementation
description: Details of the Phoenix LiveView UI system with browser service integration
metadata:
  type: project
---

Tailorr has two Phoenix LiveView UIs for tracker management, built with strict SOLID principles.

**Implementation date:** 2026-06-14

**Tech stack:**
- Phoenix 1.7.23 + LiveView 1.0.18
- Salad UI 0.14.9 (shadcn-inspired components for LiveView)
- Tailwind CSS with CSS variables for theming
- Bandit 1.12.0 HTTP server

**Two UIs:**

1. **Test UI** (`/` or `/ui/test`)
   - File: `lib/tailorr_web/live/tracker_test/test_live.ex`
   - Search across configured trackers (individual or "All")
   - Real-time results display via LiveView
   - Similar to Jackett's manual search interface

2. **Tracker Builder** (`/ui/builder`)
   - File: `lib/tailorr_web/live/tracker_builder/builder_live.ex`
   - Point-and-click selector extraction from live screenshots
   - Browser screenshot streaming via Playwright
   - Live YAML generation and preview
   - Test parsing with real results

**Browser Service Architecture:**

```
services/browser/           # Node.js + Express + Playwright
  server.js                 # HTTP API on port 3001
  package.json
  Dockerfile

lib/tailorr/browser/
  port.ex                   # GenServer bridge (Elixir ↔ Node.js via HTTP)
  session.ex                # Browser session struct

lib/tailorr/builder/        # Business logic (SRP)
  yaml_generator.ex         # Generate YAML from selectors
  validator.ex              # Validate tracker definitions
```

**SOLID Architecture Applied:**
- **SRP**: Browser.Port only handles HTTP communication; Builder only generates YAML
- **DIP**: `@browser_adapter` and `@builder_context` use compile-time injection for testing
- **ISP**: Narrow public APIs (Browser, Builder, Trackers contexts)
- **OCP**: Components use slots for extension
- **LSP**: All implementations honor behaviour contracts

**How to run:**
- Local: `make dev` (Phoenix) + `make browser` (Node.js service)
- Docker: `make dev-all DOCKER=1` (starts all services)
- Access: http://localhost:4000
- Browser service: http://localhost:3001

**Important notes:**
- Assets compile on-the-fly in dev mode (Node.js not required for basic Phoenix dev)
- Browser service requires Node.js locally or Docker
- All components follow Salad UI patterns
- Endpoint uses `otp_app: :tailorr` (NOT :tailorr_web) due to single-app structure

**How to apply:** When working on UI features, maintain SOLID principles. LiveViews should depend on context abstractions, not direct implementations. Use compile-time injection for testability.
