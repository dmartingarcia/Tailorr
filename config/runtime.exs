import Config

# Runtime configuration (for production releases and dynamic config)

if config_env() == :prod do
  database_path =
    System.get_env("DATABASE_PATH") ||
      raise """
      environment variable DATABASE_PATH is missing.
      For example: /app/data/tailorr.db
      """

  config :tailorr, Tailorr.Repo,
    database: database_path,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "5")
end
