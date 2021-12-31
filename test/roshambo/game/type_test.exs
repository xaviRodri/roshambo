defmodule Roshambo.Game.TypeTest do
  use ExUnit.Case

  alias Roshambo.Game.Type

  @valid_types [:best_of_1, :best_of_3, :best_of_5]
  @invalid_type :invalid_type
  describe "get/1" do
    test "Returns the requested game type if valid" do
      Enum.each(@valid_types, fn type ->
        assert %Type{name: ^type, games_to_win: _} = Type.get(type)
      end)
    end

    test "Returns nil if the type is not valid" do
      assert Type.get(@invalid_type) == nil
    end
  end
end
