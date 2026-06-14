defmodule Tailorr.Repo do
  use Ecto.Repo,
    otp_app: :tailorr,
    adapter: Ecto.Adapters.SQLite3
end
