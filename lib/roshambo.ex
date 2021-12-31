defmodule Roshambo do
  @moduledoc """
  Roshambo keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def start_game(mode, type) do
    id = Ecto.UUID.autogenerate()

    DynamicSupervisor.start_child(
      Roshambo.GameSupervisor,
      {Roshambo.Game,
       %{
         id: id,
         mode: mode,
         type: type,
         name: {:via, Registry, {Roshambo.GameRegistry, id}}
       }}
    )
    |> case do
      {:ok, _pid} -> {:ok, id}
      {:error, error} -> {:error, error}
    end
  end

  def add_random_player(game_id, player_name) do
    game_id |> get_game_pid() |> GenServer.call({:add_player, player_name})
  end

  def get_game_pid(game_id),
    do: Registry.lookup(Roshambo.GameRegistry, game_id) |> List.first() |> elem(0)

  def get_game(game_id), do: game_id |> get_game_pid() |> GenServer.call(:get_game)

  def pick(game_id, player, pick),
    do: game_id |> get_game_pid() |> GenServer.call({:pick, player, pick})
end
