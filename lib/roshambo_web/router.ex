defmodule RoshamboWeb.Router do
  use RoshamboWeb, :router
  import Phoenix.LiveView.Router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, {RoshamboWeb.LayoutView, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :game do
    plug(RoshamboWeb.Plugs.GamePlug)
  end

  scope "/", RoshamboWeb do
    pipe_through(:browser)

    get("/", PageController, :index)

    get("/new", NewGameController, :new)
    post("/create", NewGameController, :create)
  end

  scope "/play/", RoshamboWeb do
    pipe_through([:browser, :game])

    get("/:game_id", PlayController, :play)
  end

  # Other scopes may use custom stacks.
  # scope "/api", RoshamboWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through(:browser)

      live_dashboard("/dashboard", metrics: RoshamboWeb.Telemetry)
    end
  end
end
