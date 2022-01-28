defmodule Roshambo.Game do
  use GenServer
  alias Roshambo.Game.{Hand, Mode, Player, Score, Type}

  ############
  ### STRUCT
  ############
  @enforce_keys [:id, :mode, :type]
  defstruct current_hand: %Hand{},
            id: nil,
            mode: nil,
            players: {nil, nil},
            score: %Score{},
            hands: [],
            type: nil

  @type t :: %__MODULE__{
          current_hand: Hand.t(),
          id: binary(),
          mode: Mode.t(),
          players: {Player.t(), Player.t()},
          score: Score.t(),
          hands: list(Hand.t()),
          type: Type.t()
        }

  ############
  ### SERVER
  ############

  def start_link(%{name: registry_name} = params),
    do: GenServer.start_link(__MODULE__, params, name: registry_name)

  def init(%{id: game_id, mode: mode, type: type}) do
    case {Type.get(type), Mode.get(mode)} do
      {%Type{} = type, %Mode{} = mode} -> {:ok, %__MODULE__{id: game_id, mode: mode, type: type}}
      {%Type{}, _} -> {:stop, :invalid_mode}
      {_, %Mode{}} -> {:stop, :invalid_type}
      _ -> {:stop, [:invalid_mode, :invalid_type]}
    end
  end

  def handle_call(:add_player, _from, state) do
    case Player.add(state) do
      {:ok, game, position} -> {:reply, {:ok, game, position}, game}
      {:error, error} -> {:reply, {:error, error}, state}
    end
  end

  def handle_call({:remove_player, player_id}, _from, state) do
    case Player.remove(state, player_id) do
      {:ok, game} -> {:reply, {:ok, game}, game}
      {:error, error} -> {:reply, {:error, error}, state}
    end
  end

  def handle_call({:pick, player, pick}, _from, state) do
    case add_pick(state, player, pick) do
      {:ok, game} -> {:reply, {:ok, game}, resolve_game(game)}
      {:error, error} -> {:reply, {:error, error}, state}
    end
  end

  def handle_call(:get_game, _from, state), do: {:reply, {:ok, state}, state}

  ############
  ### HELPERS
  ############

  @spec add_pick(__MODULE__.t(), :p1 | :p2, Hand.pick()) ::
          {:ok, __MODULE__.t()} | {:error, :already_picked}
  defp add_pick(%__MODULE__{current_hand: %Hand{p1_pick: nil} = current_hand} = game, :p1, pick),
    do: {:ok, %{game | current_hand: %Hand{current_hand | p1_pick: pick}}}

  defp add_pick(%__MODULE__{current_hand: %Hand{p1_pick: _p1_pick}}, :p1, _pick),
    do: {:error, :already_picked}

  defp add_pick(%__MODULE__{current_hand: %Hand{p2_pick: nil} = current_hand} = game, :p2, pick),
    do: {:ok, %{game | current_hand: %Hand{current_hand | p2_pick: pick}}}

  defp add_pick(%__MODULE__{current_hand: %Hand{p2_pick: _p2_pick}}, :p2, _pick),
    do: {:error, :already_picked}

  defp resolve_game(game) do
    game
    |> resolve_current_hand()
    |> update_score()
    |> set_winner()
  end

  defp resolve_current_hand(%__MODULE__{current_hand: %Hand{} = hand} = game) do
    case Hand.resolve(hand) do
      %Hand{result: nil} -> game
      %Hand{result: _} = hand -> %{game | hands: game.hands ++ [hand], current_hand: %Hand{}}
    end
  end

  defp update_score(%__MODULE__{} = game), do: Score.update(game)
  defp set_winner(%__MODULE__{} = game), do: Score.set_winner(game)
end
