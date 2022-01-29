defmodule RoshamboWeb.PlayLive do
  use RoshamboWeb, :live_view

  def mount(_params, %{"game_id" => game_id, "player" => player} = _session, socket) do
    {:ok, assign(socket, game_id: game_id, player: player)}
  end
end
