defmodule Tailorr.MixProject do
  use Mix.Project

  def project do
    [
      app: :tailorr,
      version: "0.1.0",
      elixir: "~> 1.20",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      test_coverage: [
        tool: ExCoveralls,
        summary: [threshold: 90]
      ]
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

      # Phoenix
      {:phoenix, "~> 1.7.14"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.5", only: :dev},
      {:phoenix_live_view, "~> 1.0.0"},
      {:phoenix_live_dashboard, "~> 0.8.5"},
      {:phoenix_pubsub, "~> 2.1"},

      # Telemetry
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.1"},

      # UI Components
      {:heroicons,
       github: "tailwindlabs/heroicons",
       tag: "v2.1.5",
       sparse: "optimized",
       app: false,
       compile: false,
       depth: 1},
      {:salad_ui, "~> 0.14.3"},

      # I18n
      {:gettext, "~> 0.26"},

      # Assets
      {:esbuild, "~> 0.8", runtime: Mix.env() == :dev},
      {:tailwind, "~> 0.2", runtime: Mix.env() == :dev},

      # HTTP server
      {:bandit, "~> 1.5"},

      # ML / CAPTCHA solving and training (CPU-only; add {:exla, "~> 0.7"} for GPU acceleration)
      {:bumblebee, "~> 0.5"},
      {:nx, "~> 0.7"},
      {:axon, "~> 0.6"},

      # Development/Test
      {:ex_doc, "~> 0.34", only: :dev, runtime: false},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:bypass, "~> 2.1", only: :test},
      {:excoveralls, "~> 0.18", only: :test}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing"],
      "assets.build": ["tailwind tailorr", "esbuild tailorr"],
      "assets.deploy": [
        "tailwind tailorr --minify",
        "esbuild tailorr --minify",
        "phx.digest"
      ]
    ]
  end
end
