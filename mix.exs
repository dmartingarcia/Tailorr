defmodule Tailorr.Umbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      version: "0.1.0",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases(),
      releases: releases(),
      test_coverage: [
        tool: ExCoveralls,
        summary: [threshold: 90]
      ]
    ]
  end

  def cli do
    [
      preferred_envs: [
        coveralls: :test,
        "coveralls.detail": :test,
        "coveralls.post": :test,
        "coveralls.html": :test,
        "coveralls.json": :test
      ]
    ]
  end

  defp deps do
    [
      {:excoveralls, "~> 0.18", only: :test}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "cmd --app tailorr mix ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end

  defp releases do
    [
      tailorr: [
        applications: [
          tailorr: :permanent,
          tailorr_web: :permanent
        ]
      ]
    ]
  end
end
