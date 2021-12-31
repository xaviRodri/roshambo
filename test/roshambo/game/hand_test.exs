defmodule Roshambo.Game.HandTest do
  use ExUnit.Case

  alias Roshambo.Game.Hand

  describe "resolve/1" do
    @valid_ready_hand %Hand{p1_pick: :rock, p2_pick: :paper, result: nil}
    @valid_not_ready_hand %Hand{p1_pick: :rock, p2_pick: nil, result: nil}
    test "Resolves a hand successfuly when a hand is introduced" do
      assert %Hand{result: :p2} = Hand.resolve(@valid_ready_hand)
    end

    test "Returns the same provided hand if any of the picks has not been placed" do
      assert Hand.resolve(@valid_not_ready_hand) == @valid_not_ready_hand
    end

    test "Same pick results in a draw" do
      assert %Hand{result: :draw} = Hand.resolve(%Hand{p1_pick: :rock, p2_pick: :rock})
    end

    test "Rock loses against paper" do
      assert %Hand{result: :p2} = Hand.resolve(%Hand{p1_pick: :rock, p2_pick: :paper})
    end

    test "Rock wins scissors" do
      assert %Hand{result: :p1} = Hand.resolve(%Hand{p1_pick: :rock, p2_pick: :scissors})
    end

    test "Paper wins rock" do
      assert %Hand{result: :p1} = Hand.resolve(%Hand{p1_pick: :paper, p2_pick: :rock})
    end

    test "Paper loses against scissors" do
      assert %Hand{result: :p2} = Hand.resolve(%Hand{p1_pick: :paper, p2_pick: :scissors})
    end

    test "Scissors loses against rock" do
      assert %Hand{result: :p2} = Hand.resolve(%Hand{p1_pick: :scissors, p2_pick: :rock})
    end

    test "Scissors wins paper" do
      assert %Hand{result: :p1} = Hand.resolve(%Hand{p1_pick: :scissors, p2_pick: :paper})
    end
  end
end
