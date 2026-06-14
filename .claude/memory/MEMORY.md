# Tailorr — Shared Project Memory

This directory is committed to the repo so all contributors share the same context.

## Index

- [Project overview](project.md) — Goals, decisions, scope, stack (Phoenix 1.7.23 + LiveView, single-app structure)
- [Dev feedback](feedback.md) — Agreed-upon conventions and things to avoid (incl. pre-commit gate: format → lint → test)
- [Single-app structure](single-app-structure.md) — CRITICAL: NOT umbrella, all config differences
- [LiveView UI implementation](liveview-ui.md) — Test UI + Tracker Builder with browser service integration
- [CAPTCHA system](captcha-system.md) — Complete CAPTCHA solving with ML training, 4 backends, organized by tracker
- [CAPTCHA decisions](captcha-decisions.md) — Architectural decisions: files over DB, behaviour pattern, cascade strategy
- `tech-lead` agent is the entry point for non-trivial tasks — it orchestrates Plan → implement → review → test-runner
