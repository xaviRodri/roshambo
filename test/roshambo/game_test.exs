defmodule Roshambo.GameTest do
  use ExUnit.Case

  alias Roshambo.Game

  @valid_mode :classic
  @invalid_mode :invalid_mode
  @valid_type :best_of_1
  @invalid_type :invalid_type
  @valid_pick :rock

  describe "init/1" do
    test "Starts a basic game with an specific mode and type" do
      game_id = Ecto.UUID.autogenerate()
      mode = @valid_mode
      type = @valid_type

      assert {:ok,
              %Game{
                current_hand: %Game.Hand{},
                hands: [],
                id: ^game_id,
                mode: %Game.Mode{name: ^mode},
                players: {nil, nil},
                score: %Game.Score{p1_score: 0, p2_score: 0, winner: nil},
                type: %Game.Type{name: ^type}
              }} = Game.init(%{id: game_id, mode: mode, type: type})
    end

    test "Fails to start a game if any the mode or the type are not valids" do
      game_id = Ecto.UUID.autogenerate()

      assert {:stop, [:invalid_mode, :invalid_type]} =
               Game.init(%{id: game_id, mode: @invalid_mode, type: @invalid_type})

      assert {:stop, :invalid_mode} =
               Game.init(%{id: game_id, mode: @invalid_mode, type: @valid_type})

      assert {:stop, :invalid_type} =
               Game.init(%{id: game_id, mode: @valid_mode, type: @invalid_type})
    end
  end

  describe "handle_call/3 (add_player)" do
    setup :start_game

    test "Adds a player successfuly to the game", %{game_pid: game_pid} do
      assert {:ok, %Game{players: {%Game.Player{}, _}}, _position} =
               GenServer.call(game_pid, :add_player)
    end

    test "Fails to add a player", %{game_pid: game_pid} do
      GenServer.call(game_pid, :add_player)
      GenServer.call(game_pid, :add_player)

      assert {:error, _} = GenServer.call(game_pid, :add_player)
    end
  end

  describe "handle_call/3 (remove_player)" do
    setup :start_game

    test "Removes a player successfuly from the game", %{game_pid: game_pid} do
      {:ok, %Game{players: {player, _}}, _position} = GenServer.call(game_pid, :add_player)

      assert {:ok, %Game{players: {nil, _}}} =
               GenServer.call(game_pid, {:remove_player, player.id})
    end

    test "Fails to remove a player", %{game_pid: game_pid} do
      assert {:error, _} = GenServer.call(game_pid, {:remove_player, :invalid})
    end
  end

  describe "handle_call/3 (pick)" do
    setup :start_game

    test "Adds successfuly a pick to the current hand", %{game_pid: game_pid} do
      {:ok, %Game{players: {_player, _}}, _position} = GenServer.call(game_pid, :add_player)

      assert {:ok, %Game{}} = GenServer.call(game_pid, {:pick, :p1, @valid_pick})
      assert {:ok, %Game{}} = GenServer.call(game_pid, {:pick, :p2, @valid_pick})
    end

    test "Fails to pick for player1", %{game_pid: game_pid} do
      {:ok, %Game{}} = GenServer.call(game_pid, {:pick, :p1, @valid_pick})

      assert {:error, _} = GenServer.call(game_pid, {:pick, :p1, @valid_pick})
    end

    test "Fails to pick for player2", %{game_pid: game_pid} do
      {:ok, %Game{}} = GenServer.call(game_pid, {:pick, :p2, @valid_pick})

      assert {:error, _} = GenServer.call(game_pid, {:pick, :p2, @valid_pick})
    end
  end

  describe "handle_call/3 (get_game)" do
    setup :start_game

    test "Returns the game's state", %{game_pid: game_pid} do
      assert {:ok, %Game{}} = GenServer.call(game_pid, :get_game)
    end
  end

  defp start_game(_context) do
    game_id = Ecto.UUID.autogenerate()

    pid =
      start_supervised!(
        {Game,
         %{
           id: game_id,
           mode: :classic,
           name: {:via, Registry, {Roshambo.GameRegistry, game_id}},
           type: :best_of_3
         }}
      )

    [game_pid: pid]
  end
end
