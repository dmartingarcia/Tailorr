SHELL := /bin/bash
COMPOSE := docker compose
APP := $(COMPOSE) run --rm app
TRACKER ?= ""
UID := $(shell id -u)
GID := $(shell id -g)

.DEFAULT_GOAL := help

.PHONY: help setup dev build stop down clean \
        test test-tracker lint shell \
        db-migrate db-reset db-console \
        logs ps \
        flare-logs flare-restart

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── Setup & lifecycle ────────────────────────────────────────────────────────

setup: ## First-time setup: pull images, build, create DB and run migrations
	$(COMPOSE) pull
	$(COMPOSE) build
	$(COMPOSE) up -d db flaresolverr
	@sleep 3
	$(APP) mix do deps.get, compile
	$(APP) mix ecto.create
	$(APP) mix ecto.migrate
	@echo ""
	@echo "✓ Tailorr is ready. Run 'make dev' to start."

dev: ## Start all services with hot reload (foreground)
	$(COMPOSE) up

build: ## Build production Docker image
	$(COMPOSE) build app

stop: ## Stop all running services
	$(COMPOSE) stop

down: ## Stop and remove containers
	$(COMPOSE) down

clean: ## Remove containers, volumes, and build artifacts
	@read -p "This will delete all local data. Continue? [y/N] " confirm; \
	[[ $$confirm == [yY] ]] || exit 1
	$(COMPOSE) down -v --remove-orphans
	rm -rf apps/tailorr/_build apps/tailorr/deps

# ── Development ──────────────────────────────────────────────────────────────

shell: ## Open an IEx shell inside the app container
	$(APP) iex -S mix

shell-db: ## Connect to PostgreSQL with psql
	$(COMPOSE) exec db psql -U tailorr tailorr_dev

# ── Testing & linting ────────────────────────────────────────────────────────

test: ## Run the full test suite
	$(APP) mix test

test-watch: ## Run tests in watch mode
	$(APP) mix test.watch

test-tracker: ## Test a single tracker definition: make test-tracker TRACKER=nyaa
	@[ -n "$(TRACKER)" ] || (echo "Usage: make test-tracker TRACKER=<id>"; exit 1)
	$(APP) mix tailorr.test_tracker $(TRACKER)

lint: ## Run Credo + format check
	$(APP) mix do credo --strict, format --check-formatted

format: ## Auto-format all Elixir code
	$(APP) mix format

# ── Database ─────────────────────────────────────────────────────────────────

db-migrate: ## Run pending Ecto migrations
	$(APP) mix ecto.migrate

db-rollback: ## Roll back the last Ecto migration
	$(APP) mix ecto.rollback

db-reset: ## Drop, recreate, and migrate the database (dev only)
	@read -p "This will DESTROY all data in the dev database. Continue? [y/N] " confirm; \
	[[ $$confirm == [yY] ]] || exit 1
	$(APP) mix do ecto.drop, ecto.create, ecto.migrate

db-seed: ## Run database seeds
	$(APP) mix run priv/repo/seeds.exs

# ── Logs & status ────────────────────────────────────────────────────────────

logs: ## Tail logs for all services
	$(COMPOSE) logs -f

logs-app: ## Tail app logs only
	$(COMPOSE) logs -f app

flare-logs: ## Tail FlareSolverr logs
	$(COMPOSE) logs -f flaresolverr

flare-restart: ## Restart FlareSolverr (useful after CF challenge failures)
	$(COMPOSE) restart flaresolverr

ps: ## Show running service status
	$(COMPOSE) ps
