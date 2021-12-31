defmodule RoshamboTest do
  use ExUnit.Case

  describe "start_game/2" do
    @valid_mode :classic
    @invalid_mode :invalid_mode

    @valid_type :best_of_3
    @invalid_type :invalid_type

    test "Starts a game successfully if both mode and type are valids" do
      assert {:ok, _id} = Roshambo.start_game(@valid_mode, @valid_type)
    end

    test "Fails to start a game if either mode or type are not valids" do
      assert {:error, :invalid_type} = Roshambo.start_game(@valid_mode, @invalid_type)
      assert {:error, :invalid_mode} = Roshambo.start_game(@invalid_mode, @valid_type)

      assert {:error, [:invalid_mode, :invalid_type]} =
               Roshambo.start_game(@invalid_mode, @invalid_type)
    end
  end
end
