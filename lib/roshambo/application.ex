defmodule Roshambo.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Roshambo.Repo,
      # Start the Telemetry supervisor
      RoshamboWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Roshambo.PubSub},
      # Start the Endpoint (http/https)
      RoshamboWeb.Endpoint,
      # Game Registry
      {Registry, keys: :unique, name: Roshambo.GameRegistry},
      # Game Dynamic Supervisor
      {DynamicSupervisor, strategy: :one_for_one, name: Roshambo.GameSupervisor}
      # Start a worker by calling: Roshambo.Worker.start_link(arg)
      # {Roshambo.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Roshambo.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RoshamboWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
