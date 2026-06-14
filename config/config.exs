import Config

# Configure the Tailorr application
config :tailorr,
  ecto_repos: [Tailorr.Repo]

# API Keys for Torznab endpoint (empty list = no auth required)
# Set via environment: TAILORR_API_KEYS=key1,key2,key3
config :tailorr, :api_keys, []

# CAPTCHA solver backend (:manual, :tesseract, :twocaptcha, :anticaptcha)
config :tailorr, :captcha_backend, :manual

# Configure the repository
config :tailorr, Tailorr.Repo,
  database: Path.expand("../tailorr_dev.db", Path.dirname(__ENV__.file)),
  pool_size: 5,
  stacktrace: true,
  show_sensitive_data_on_connection_error: true

# Configure logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure Oban (background jobs)
config :tailorr, Oban,
  repo: Tailorr.Repo,
  plugins: [],
  queues: [default: 10]

# Import environment specific config
import_config "#{config_env()}.exs"
