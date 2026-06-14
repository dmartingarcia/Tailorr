import Config

# Configure the logger for test
config :logger, level: :warning

# Configure the repository for test
config :tailorr, Tailorr.Repo,
  database: Path.expand("../tailorr_test.db", Path.dirname(__ENV__.file)),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10
