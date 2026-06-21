# Dockerfile for Tailorr Phoenix app
FROM elixir:1.20-alpine AS build

# Install build dependencies
RUN apk add --no-cache build-base git nodejs npm

WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Set build ENV
ENV MIX_ENV=dev

# Copy mix files
COPY mix.exs mix.lock ./

# Install dependencies
RUN mix deps.get --only $MIX_ENV
RUN mix deps.compile

# Copy application code
COPY lib ./lib
COPY priv ./priv
COPY config ./config
COPY assets ./assets

# Install npm dependencies and build assets
WORKDIR /app/assets
RUN npm install

WORKDIR /app
RUN mix assets.deploy

# Compile app
RUN mix compile

# Development stage
FROM elixir:1.20-alpine AS dev

RUN apk add --no-cache \
    libstdc++ ncurses-libs bash inotify-tools nodejs npm \
    tesseract-ocr tesseract-ocr-data-eng \
    imagemagick

WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=dev

EXPOSE 4000

CMD ["mix", "phx.server"]
