defmodule RoshamboWeb.PlayController do
  use RoshamboWeb, :controller
  import Phoenix.LiveView.Controller

  def play(%{status: 404} = conn, _params) do
    render(conn, "404.html")
  end

  def play(%{status: 403} = conn, _params) do
    render(conn, "403.html")
  end

  def play(%{assigns: %{game_id: game_id, player: player}} = conn, _params) do
    live_render(conn, RoshamboWeb.PlayLive, session: %{"game_id" => game_id, "player" => player})
  end
end
