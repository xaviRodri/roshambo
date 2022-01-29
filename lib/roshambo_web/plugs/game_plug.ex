defmodule RoshamboWeb.Plugs.GamePlug do
  use Plug.Builder

  def call(conn, opts) do
    conn
    |> super(opts)
    |> fetch_cookies(signed: ["roshambo-game"])
    |> maybe_assign_game_id
  end

  # Both the game_id stored in the cookies and the one in the params must be the same
  defp maybe_assign_game_id(
         %{
           cookies: %{"roshambo-game" => %{game_id: game_id, player: player}},
           params: %{"game_id" => game_id}
         } = conn
       ),
       do: conn |> assign(:game_id, game_id) |> assign(:player, player)

  defp maybe_assign_game_id(%{params: %{"game_id" => game_id}} = conn) do
    with true <- Roshambo.game_exists?(game_id),
         {:ok, _game, player} <- Roshambo.add_random_player(game_id) do
      conn
      |> assign(:game_id, game_id)
      |> assign(:player, player)
      |> put_resp_cookie("roshambo-game", %{game_id: game_id, player: player}, sign: true)
    else
      false -> put_status(conn, 404)
      {:error, :is_full} -> put_status(conn, 403)
    end
  end
end
