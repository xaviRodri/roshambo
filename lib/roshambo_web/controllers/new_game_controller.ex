defmodule RoshamboWeb.NewGameController do
  use RoshamboWeb, :controller
  alias Roshambo.Game.{Mode, Type}

  def new(conn, _params) do
    types = Type.get_all()
    modes = Mode.get_all()
    render(conn, "new.html", types: types, modes: modes)
  end

  def create(conn, %{"game" => %{"mode" => mode, "type" => type}} = _params) do
    case Roshambo.start_game(mode, type) do
      {:ok, game_id} ->
        conn |> redirect(to: "/play/#{game_id}")

      {:error, _error} ->
        conn |> put_flash(:error, "Some error occurred.") |> redirect(to: "/new")
    end
  end
end
