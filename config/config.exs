import Config

# Configure the Tailorr application
config :tailorr,
  ecto_repos: [Tailorr.Repo]

# API Keys for Torznab endpoint (empty list = no auth required)
# Set via environment: TAILORR_API_KEYS=key1,key2,key3
config :tailorr, :api_keys, []

# CAPTCHA solver backend
# Available: :mock (testing), :manual (CLI prompt), :ocr (Tesseract),
#            :telegram (Telegram bot), :twocaptcha, :anticaptcha
config :tailorr, :captcha_backend, :manual

# Telegram CAPTCHA solver configuration (if using :telegram backend)
# Get bot token from @BotFather on Telegram
# Get chat_id by messaging your bot and checking:
# https://api.telegram.org/bot<TOKEN>/getUpdates
config :tailorr, :telegram_captcha,
  bot_token: System.get_env("TELEGRAM_BOT_TOKEN"),
  chat_id: System.get_env("TELEGRAM_CHAT_ID")

# Configure the repository
config :tailorr, Tailorr.Repo,
  database: Path.expand("../tailorr_dev.db", Path.dirname(__ENV__.file)),
  pool_size: 5,
  stacktrace: true,
  show_sensitive_data_on_connection_error: true

# Configure Oban (background jobs)
config :tailorr, Oban,
  repo: Tailorr.Repo,
  plugins: [],
  queues: [default: 10]

# Configure TailorrWeb endpoint
config :tailorr, TailorrWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: TailorrWeb.ErrorHTML, json: TailorrWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Tailorr.PubSub,
  live_view: [signing_salt: "tailorr_live_view_salt"]

# Configure esbuild (asset bundler for JS)
config :esbuild,
  version: "0.17.11",
  tailorr: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (CSS framework)
config :tailwind,
  version: "3.4.0",
  tailorr: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configure logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config
import_config "#{config_env()}.exs"
