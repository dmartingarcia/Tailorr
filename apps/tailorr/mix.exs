defmodule Tailorr.MixProject do
  use Mix.Project

  def project do
    [
      app: :tailorr,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.20",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      mod: {Tailorr.Application, []},
      extra_applications: [:logger, :runtime_tools, :crypto]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      # Database
      {:ecto_sql, "~> 3.12"},
      {:ecto_sqlite3, "~> 0.17"},

      # Background jobs
      {:oban, "~> 2.22"},

      # Cache
      {:cachex, "~> 4.1"},

      # HTTP client
      {:req, "~> 0.5.17"},

      # HTML parsing
      {:floki, "~> 0.38.3"},

      # YAML parsing
      {:yaml_elixir, "~> 2.12"},

      # JSON
      {:jason, "~> 1.4"},

      # Development/Test
      {:ex_doc, "~> 0.34", only: :dev, runtime: false},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
