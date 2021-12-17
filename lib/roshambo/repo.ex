defmodule Roshambo.Repo do
  use Ecto.Repo,
    otp_app: :roshambo,
    adapter: Ecto.Adapters.Postgres
end
