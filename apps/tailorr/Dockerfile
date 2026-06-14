# ── Builder ─────────────────────────────────────────────────────────────────
FROM elixir:1.20-alpine AS builder

RUN apk add --no-cache build-base git

WORKDIR /app

COPY mix.exs mix.lock ./
RUN mix local.hex --force && mix local.rebar --force
RUN mix deps.get --only prod

COPY . .

RUN MIX_ENV=prod mix do compile, release

# ── Runtime ─────────────────────────────────────────────────────────────────
FROM alpine:3.22 AS runtime

RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app
RUN chown -R nobody:nobody /app
USER nobody

COPY --from=builder --chown=nobody:nobody /app/_build/prod/rel/tailorr ./

EXPOSE 4000

CMD ["./bin/tailorr", "start"]

# ── Development (default target) ────────────────────────────────────────────
FROM elixir:1.20-alpine AS dev

RUN apk add --no-cache build-base git inotify-tools

RUN mix local.hex --force && mix local.rebar --force

WORKDIR /app

EXPOSE 4000

CMD ["mix", "phx.server"]
