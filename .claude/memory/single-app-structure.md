---
name: tailorr-single-app-not-umbrella
description: CRITICAL - Tailorr is a single-app Phoenix project, NOT umbrella
metadata:
  type: project
---

**CRITICAL: Tailorr uses single-app Phoenix structure, NOT umbrella.**

**User requirement:** "ni se te ocurra ponerme un proyecto umbrella" (don't you dare make it an umbrella project)

**Migration history:**
- Initial implementation (by another agent) incorrectly used umbrella structure
- 2026-06-14: Converted from umbrella to single app
- User was very upset about the umbrella structure

**Structure:**
```
lib/
  tailorr/        # Core business logic (contexts, agents, trackers)
  tailorr_web/    # Phoenix web layer (LiveView, controllers, endpoints)
```

NOT:
```
apps/
  tailorr/
  tailorr_web/
```

**Key configuration differences:**

1. **Endpoint** (`lib/tailorr_web/endpoint.ex`):
   ```elixir
   use Phoenix.Endpoint, otp_app: :tailorr  # NOT :tailorr_web
   ```

2. **Static files**:
   ```elixir
   plug Plug.Static, at: "/", from: :tailorr  # NOT :tailorr_web
   ```

3. **Config paths** (`config/*.exs`):
   ```elixir
   config :tailorr, TailorrWeb.Endpoint, ...  # NOT :tailorr_web
   ```

4. **Asset paths** (`config/config.exs`):
   ```elixir
   config :esbuild, tailorr: [  # NOT tailorr_web
     cd: Path.expand("../assets", __DIR__)  # NOT ../apps/tailorr_web/assets
   ]
   ```

5. **Single mix.exs** at project root, not multiple in apps/

**Why single-app:**
- Simpler dependency management
- Easier testing
- Clearer module boundaries
- User preference (strongly stated)

**How to apply:**
- NEVER create `apps/` directory
- NEVER suggest umbrella app structure
- All `otp_app` references use `:tailorr`
- All module paths start with `lib/tailorr/` or `lib/tailorr_web/`
- Single `mix.exs` at project root
- When in doubt, check `CLAUDE.md` for current structure
