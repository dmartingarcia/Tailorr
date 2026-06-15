import Config

# Configure the logger for test
config :logger, level: :warning

# Configure the repository for test
config :tailorr, Tailorr.Repo,
  database: Path.expand("../tailorr_test.db", Path.dirname(__ENV__.file)),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# Configure endpoint for LiveView tests
config :tailorr, TailorrWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "tailorr_test_secret_key_base_very_long_string_for_tests_aaaaaabb",
  server: false
