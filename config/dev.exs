import Config

# Configure the logger for development
config :logger, :console,
  format: "[$level] $message\n",
  level: :debug

# Set a higher stacktrace during development
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# Configure TailorrWeb Endpoint for development
config :tailorr, TailorrWeb.Endpoint,
  # Binding to loopback ipv4 address prevents access from other machines.
  # Change to `ip: {0, 0, 0, 0}` to allow access from other machines.
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "tailorr_dev_secret_key_base_for_development_only_not_for_production_use",
  watchers: [
    esbuild: {Esbuild, :install_and_run, [:tailorr, ~w(--sourcemap=inline --watch)]},
    tailwind: {Tailwind, :install_and_run, [:tailorr, ~w(--watch)]}
  ]

# Watch static and templates for browser reloading.
config :tailorr, TailorrWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/(?!uploads/).*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/tailorr_web/(controllers|live|components)/.*(ex|heex)$"
    ]
  ]

# Enable dev routes for dashboard and mailbox
config :tailorr, dev_routes: true
