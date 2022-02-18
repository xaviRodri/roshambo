defmodule RoshamboWeb.UserScoreComponent do
  use Phoenix.LiveComponent

  def render(assigns) do
    ~H"""
    <div id={"player-#{@id}"}>
      <%= @id %> Score: <%= @score %>
    </div>
    """
  end

  def update(%{game_id: game_id, id: player} = assigns, socket) do
    {:ok, %Roshambo.Game{score: score}} = Roshambo.get_game(game_id)

    {:ok, assign(socket, Map.merge(assigns, %{score: Map.get(score, player)}))}
  end
end
