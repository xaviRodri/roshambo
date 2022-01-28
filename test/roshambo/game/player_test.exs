defmodule Roshambo.Game.PlayerTest do
  use ExUnit.Case
  alias Roshambo.Game
  alias Roshambo.Game.{Mode, Player, Type}

  describe "add/2" do
    @valid_game %Game{id: "1234", mode: Mode.get(:classic), type: Type.get(:best_of_1)}

    @invalid_player_name :not_a_binary

    test "Adds a player to a game successfuly when the game and the player name are valids" do
      assert {:ok, %Game{players: {%Player{}, _}}, _position} = Player.add(@valid_game)
    end

    test "Adds a second player to a game when a previous player was inserted" do
      {:ok, game, _position} = Player.add(@valid_game)

      assert {:ok, %Game{players: {%Player{}, %Player{}}}, _position} = Player.add(game)
    end

    test "Fails to add a player if the player name is invalid" do
      assert {:error, :not_a_player} = Player.add(@valid_game, @invalid_player_name)
    end

    test "Fails to add a player if the game is full (2 players already in)" do
      {:ok, game, _position} = Player.add(@valid_game)
      {:ok, game, _position} = Player.add(game)

      assert {:error, :is_full} = Player.add(game)
    end
  end

  describe "remove/2" do
    test "Removes player 1 from a game successfuly if the player was inside the game" do
      {:ok, %Game{players: {%Player{id: player_id}, _}} = game, _position} =
        Player.add(@valid_game)

      assert {:ok, _game} = Player.remove(game, player_id)
    end

    test "Removes player 2 from a game successfuly if the player was inside the game" do
      {:ok, game, _position} = Player.add(@valid_game)

      {:ok, %Game{players: {_, %Player{id: player_id}}} = game, _position} = Player.add(game)

      assert {:ok, _game} = Player.remove(game, player_id)
    end

    test "Fails to remove a player from a game is the id provided doesn't match to any player in the game" do
      {:ok, game, _position} = Player.add(@valid_game)

      assert {:error, :no_player} = Player.remove(game, "player_id")
    end
  end
end
