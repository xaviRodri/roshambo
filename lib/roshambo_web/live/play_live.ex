defmodule RoshamboWeb.PlayLive do
  use RoshamboWeb, :live_view

  def mount(_params, %{"game_id" => game_id, "player" => player} = _session, socket) do
    RoshamboWeb.Endpoint.subscribe("game-#{game_id}")

    {:ok, %Roshambo.Game{current_hand: current_hand, score: %{winner: winner}}} =
      Roshambo.get_game(game_id)

    {:ok,
     assign(socket,
       game_id: game_id,
       player: player,
       winner: winner,
       current_picks: %{p1: current_hand.p1_pick, p2: current_hand.p2_pick}
     )}
  end

  def handle_event(
        "pick",
        %{"pick" => pick},
        %{assigns: %{game_id: game_id, player: player}} = socket
      ) do
    Roshambo.pick(game_id, player, String.to_atom(pick))

    {:noreply, socket}
  end

  def handle_info(%{event: "game_update", payload: game}, socket) do
    send_update(RoshamboWeb.UserScoreComponent, id: :p1, score: game.score)
    send_update(RoshamboWeb.UserScoreComponent, id: :p2, score: game.score)

    socket =
      if not is_nil(game.score.winner) do
        assign(socket, winner: game.score.winner)
      else
        socket
      end

    socket =
      assign(socket,
        current_picks: %{p1: game.current_hand.p1_pick, p2: game.current_hand.p2_pick}
      )

    {:noreply, socket}
  end
end
