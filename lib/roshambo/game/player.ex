defmodule Roshambo.Game.Player do
  alias Roshambo.Game

  @enforce_keys [:id, :name]
  defstruct [:id, :name]
  @type t :: %__MODULE__{id: binary(), name: binary()}

  @doc """
  Adds a new player to a game.

  In order to do it, receives a player name and creates a new player that will be
  introduced in the provided game.

  If the player name is not valid or the game is full, it will
  return an error.
  """
  @spec add(Game.t(), binary() | __MODULE__.t()) ::
          {:ok, Game.t()} | {:error, :already_in} | {:error, :is_full}

  def add(%Game{} = game, player_name) when is_binary(player_name),
    do: add(game, %__MODULE__{id: Ecto.UUID.autogenerate(), name: player_name})

  def add(%Game{players: {nil, p2}} = game, %__MODULE__{} = player),
    do: {:ok, %{game | players: {player, p2}}}

  def add(%Game{players: {p1, nil}} = game, %__MODULE__{} = player),
    do: {:ok, %{game | players: {p1, player}}}

  def add(%Game{players: {_p1, _p2}} = _game, %__MODULE__{} = _player),
    do: {:error, :is_full}

  def add(%Game{players: {_p1, _p2}} = _game, _player),
    do: {:error, :not_a_player}

  @doc """
  Removes a player from a game.

  It receives a player identifier and tries to find it in the provided game.

  If the player is in the game, it will be removed. If not, an error will be returned.
  """
  @spec remove(Game.t(), binary()) :: {:ok, Game.t()} | {:error, :no_player}
  def remove(%Game{players: {%__MODULE__{id: player_id}, p2}} = game, player_id),
    do: {:ok, %{game | players: {nil, p2}}}

  def remove(%Game{players: {p1, %__MODULE__{id: player_id}}} = game, player_id),
    do: {:ok, %{game | players: {p1, nil}}}

  def remove(%Game{players: {_p1, _p2}} = _game, _player_id),
    do: {:error, :no_player}
end
