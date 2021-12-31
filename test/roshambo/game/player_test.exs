defmodule Roshambo.Game.PlayerTest do
  use ExUnit.Case
  alias Roshambo.Game
  alias Roshambo.Game.{Mode, Player, Type}

  describe "add/2" do
    @valid_game %Game{id: "1234", mode: Mode.get(:classic), type: Type.get(:best_of_1)}

    @valid_player_name "Player 1"
    @invalid_player_name :not_a_binary

    test "Adds a player to a game successfuly when the game and the player name are valids" do
      assert {:ok, %Game{players: {%Player{name: @valid_player_name}, _}}} =
               Player.add(@valid_game, @valid_player_name)
    end

    test "Adds a second player to a game when a previous player was inserted" do
      {:ok, game} = Player.add(@valid_game, @valid_player_name)

      assert {:ok,
              %Game{
                players: {%Player{name: @valid_player_name}, %Player{name: @valid_player_name}}
              }} = Player.add(game, @valid_player_name)
    end

    test "Fails to add a player if the player name is invalid" do
      assert {:error, :not_a_player} = Player.add(@valid_game, @invalid_player_name)
    end

    test "Fails to add a player if the game is full (2 players already in)" do
      {:ok, game} = Player.add(@valid_game, @valid_player_name)
      {:ok, game} = Player.add(game, @valid_player_name)

      assert {:error, :is_full} = Player.add(game, @valid_player_name)
    end
  end

  describe "remove/2" do
    test "Removes player 1 from a game successfuly if the player was inside the game" do
      {:ok, %Game{players: {%Player{id: player_id}, _}} = game} =
        Player.add(@valid_game, @valid_player_name)

      assert {:ok, _game} = Player.remove(game, player_id)
    end

    test "Removes player 2 from a game successfuly if the player was inside the game" do
      {:ok, game} = Player.add(@valid_game, @valid_player_name)

      {:ok, %Game{players: {_, %Player{id: player_id}}} = game} =
        Player.add(game, @valid_player_name)

      assert {:ok, _game} = Player.remove(game, player_id)
    end

    test "Fails to remove a player from a game is the id provided doesn't match to any player in the game" do
      {:ok, game} = Player.add(@valid_game, @valid_player_name)

      assert {:error, :no_player} = Player.remove(game, "player_id")
    end
  end
end
