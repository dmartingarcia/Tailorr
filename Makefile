SHELL := /bin/bash
COMPOSE := docker compose
DOCKER ?= 0

# Conditional command prefix: Docker or local
ifeq ($(DOCKER),1)
	RUN := $(COMPOSE) run --rm app
	RUN_BROWSER := $(COMPOSE) run --rm browser
	EXEC := $(COMPOSE) exec app
	EXEC_BROWSER := $(COMPOSE) exec browser
else
	RUN :=
	RUN_BROWSER := cd services/browser &&
	EXEC :=
	EXEC_BROWSER := cd services/browser &&
endif

TRACKER ?= ""
UID := $(shell id -u)
GID := $(shell id -g)

.DEFAULT_GOAL := help

.PHONY: help setup dev server browser dev-all build stop down clean \
        test test-watch test-tracker test-coverage test-coverage-html lint format shell shell-db \
        db-migrate db-rollback db-reset db-seed \
        assets-setup assets-build assets-deploy assets-watch \
        logs logs-app ps \
        flare-logs flare-restart browser-logs \
        install-hooks install compile migrate

help: ## Show this help
	@echo ""
	@echo "Usage: make [target] [DOCKER=1]"
	@echo ""
	@echo "  DOCKER=0 (default) - Run locally without Docker"
	@echo "  DOCKER=1           - Run everything in Docker containers"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make dev              # Start Phoenix locally"
	@echo "  make dev DOCKER=1     # Start Phoenix in Docker"
	@echo "  make dev-all          # Start Phoenix + Browser service"
	@echo ""

# ── Setup & lifecycle ────────────────────────────────────────────────────────

setup: install-hooks ## First-time setup
ifeq ($(DOCKER),1)
	@echo "Setting up with Docker..."
	$(COMPOSE) pull
	$(COMPOSE) build
	$(COMPOSE) up -d db flaresolverr browser
	@sleep 3
	$(RUN) mix do deps.get, compile
	$(RUN) mix ecto.create
	$(RUN) mix ecto.migrate
	$(RUN_BROWSER) npm install
else
	@echo "Setting up locally..."
	mix deps.get
	mix compile
	mix ecto.create
	mix ecto.migrate
	cd services/browser && npm install
	cd assets && npm install
endif
	@echo ""
	@echo "✓ Tailorr is ready!"
	@echo "  Run 'make dev' to start Phoenix"
	@echo "  Run 'make dev-all' to start Phoenix + Browser service"

install-hooks: ## Install git hooks via lefthook
	@which lefthook > /dev/null 2>&1 || (echo "lefthook not found — run: brew install lefthook" && exit 1)
	lefthook install
	@echo "✓ Git hooks installed."

# ── Development ──────────────────────────────────────────────────────────────

dev: ## Start Phoenix server (use DOCKER=1 for container)
ifeq ($(DOCKER),1)
	@echo "Starting Phoenix in Docker..."
	$(COMPOSE) up app
else
	@echo "Starting Phoenix locally on http://localhost:4000"
	mix phx.server
endif

server: dev ## Alias for 'dev'

browser: ## Start browser service (use DOCKER=1 for container)
ifeq ($(DOCKER),1)
	@echo "Starting browser service in Docker..."
	$(COMPOSE) up browser
else
	@echo "Starting browser service on http://localhost:3001"
	cd services/browser && npm start
endif

dev-all: ## Start Phoenix + Browser service (use DOCKER=1 for containers)
ifeq ($(DOCKER),1)
	@echo "Starting all services in Docker..."
	$(COMPOSE) up app browser
else
	@echo "Starting Phoenix + Browser service locally..."
	@echo "Run these in separate terminals:"
	@echo "  1) make dev"
	@echo "  2) make browser"
	@echo ""
	@echo "Or run with DOCKER=1: make dev-all DOCKER=1"
endif

build: ## Build production Docker image
	$(COMPOSE) build app browser

stop: ## Stop all running services
ifeq ($(DOCKER),1)
	$(COMPOSE) stop
else
	@echo "Kill local processes manually (Ctrl+C in terminals)"
endif

down: ## Stop and remove containers (Docker only)
	$(COMPOSE) down

clean: ## Remove containers, volumes, and build artifacts
	@read -p "This will delete all local data. Continue? [y/N] " confirm; \
	[[ $$confirm == [yY] ]] || exit 1
ifeq ($(DOCKER),1)
	$(COMPOSE) down -v --remove-orphans
endif
	rm -rf _build deps node_modules assets/node_modules services/browser/node_modules
	rm -f tailorr_dev.db tailorr_test.db

# ── Shell ────────────────────────────────────────────────────────────────────

shell: ## Open an IEx shell
ifeq ($(DOCKER),1)
	$(RUN) iex -S mix
else
	iex -S mix
endif

shell-db: ## Connect to database
ifeq ($(DOCKER),1)
	$(COMPOSE) exec db psql -U tailorr tailorr_dev
else
	sqlite3 tailorr_dev.db
endif

# ── Testing & linting ────────────────────────────────────────────────────────

test: ## Run the full test suite
	$(RUN) mix test

test-watch: ## Run tests in watch mode
	$(RUN) mix test.watch

test-tracker: ## Test a single tracker: make test-tracker TRACKER=nyaa
	@[ -n "$(TRACKER)" ] || (echo "Usage: make test-tracker TRACKER=<id>"; exit 1)
	$(RUN) mix tailorr.test_tracker $(TRACKER)

test-coverage: ## Run tests with coverage report in console
	$(RUN) mix coveralls

test-coverage-html: ## Generate HTML coverage report
	$(RUN) mix coveralls.html
	@echo ""
	@echo "✓ Coverage report: cover/excoveralls.html"

lint: ## Run Credo + format check
	$(RUN) mix do credo --strict, format --check-formatted

format: ## Auto-format all Elixir code
	$(RUN) mix format

# ── Database ─────────────────────────────────────────────────────────────────

db-migrate: ## Run pending Ecto migrations
	$(RUN) mix ecto.migrate

db-rollback: ## Roll back the last migration
	$(RUN) mix ecto.rollback

db-reset: ## Drop, recreate, and migrate database
	@read -p "This will DESTROY all data. Continue? [y/N] " confirm; \
	[[ $$confirm == [yY] ]] || exit 1
	$(RUN) mix do ecto.drop, ecto.create, ecto.migrate

db-seed: ## Run database seeds
	$(RUN) mix run priv/repo/seeds.exs

# ── Assets ───────────────────────────────────────────────────────────────────

assets-setup: ## Install npm dependencies for assets
ifeq ($(DOCKER),1)
	$(RUN) mix assets.setup
else
	cd assets && npm install
	mix tailwind.install
	mix esbuild.install
endif

assets-build: ## Build assets for development
ifeq ($(DOCKER),1)
	$(RUN) mix assets.build
else
	mix assets.build
endif

assets-deploy: ## Build and minify assets for production
ifeq ($(DOCKER),1)
	$(RUN) mix assets.deploy
else
	mix assets.deploy
endif

assets-watch: ## Watch and rebuild assets on change (runs in foreground)
ifeq ($(DOCKER),1)
	@echo "Asset watching is handled by Phoenix LiveReload in dev mode"
else
	@echo "Run 'make dev' — asset watching is automatic with LiveReload"
endif

# ── Logs & status ────────────────────────────────────────────────────────────

logs: ## Tail logs for all services (Docker only)
ifeq ($(DOCKER),1)
	$(COMPOSE) logs -f
else
	@echo "Logs are in the terminal where you ran 'make dev' or 'make browser'"
endif

logs-app: ## Tail Phoenix logs (Docker only)
ifeq ($(DOCKER),1)
	$(COMPOSE) logs -f app
else
	@echo "Phoenix logs are in the terminal where you ran 'make dev'"
endif

browser-logs: ## Tail browser service logs
ifeq ($(DOCKER),1)
	$(COMPOSE) logs -f browser
else
	@echo "Browser service logs are in the terminal where you ran 'make browser'"
endif

flare-logs: ## Tail FlareSolverr logs (Docker only)
	$(COMPOSE) logs -f flaresolverr

flare-restart: ## Restart FlareSolverr (Docker only)
	$(COMPOSE) restart flaresolverr

ps: ## Show running service status
ifeq ($(DOCKER),1)
	$(COMPOSE) ps
else
	@echo "Check running processes with: ps aux | grep -E '(beam|node)'"
endif

# ── Quick commands ───────────────────────────────────────────────────────────

.PHONY: install compile migrate

install: ## Install dependencies (mix + npm)
	$(RUN) mix deps.get
	$(RUN_BROWSER) npm install
ifeq ($(DOCKER),0)
	cd assets && npm install
endif

compile: ## Compile Elixir code
	$(RUN) mix compile

migrate: db-migrate ## Alias for db-migrate
