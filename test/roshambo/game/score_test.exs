defmodule Roshambo.Game.ScoreTest do
  use ExUnit.Case

  alias Roshambo.Game
  alias Roshambo.Game.{Hand, Mode, Player, Score, Type}

  describe "update/1" do
    test "Updates the game's score when no winner is set yet" do
      game = build_non_finished_game()

      assert %Game{score: %Score{p1_score: 1, p2_score: 1}} = Score.update(game)
    end

    test "Returns the provided game if the game has already finished" do
      game = build_finished_game()

      assert Score.update(game) == game
    end
  end

  describe "set_winner/1" do
    test "Sets the game's winner when any of the players has a winner score" do
      game = build_almost_finished_game() |> Score.update()

      assert %Game{score: %Score{winner: :p1}} = Score.set_winner(game)
    end

    test "Returns the game when a winner has already been set" do
      game = build_finished_game()

      assert Score.set_winner(game) == game
    end

    test "Returns the game when there isn't a winner score" do
      game = build_non_finished_game()

      assert Score.set_winner(game) == game
    end
  end

  defp build_non_finished_game do
    %Game{
      hands: [
        %Hand{p1_pick: :rock, p2_pick: :scissors, result: :p1},
        %Hand{p1_pick: :scissors, p2_pick: :paper, result: :p2},
        %Hand{p1_pick: :rock, p2_pick: :rock, result: :draw}
      ],
      id: "1234",
      mode: Mode.get(:classic),
      players: {%Player{id: "1", name: "P1"}, %Player{id: "2", name: "P2"}},
      type: Type.get(:best_of_3)
    }
  end

  defp build_almost_finished_game do
    %Game{
      hands: [
        %Hand{p1_pick: :rock, p2_pick: :scissors, result: :p1},
        %Hand{p1_pick: :scissors, p2_pick: :paper, result: :p2},
        %Hand{p1_pick: :rock, p2_pick: :rock, result: :draw},
        %Hand{p1_pick: :rock, p2_pick: :scissors, result: :p1}
      ],
      id: "1234",
      mode: Mode.get(:classic),
      players: {%Player{id: "1", name: "P1"}, %Player{id: "2", name: "P2"}},
      type: Type.get(:best_of_3)
    }
  end

  defp build_finished_game do
    %Game{
      hands: [%Hand{p1_pick: :rock, p2_pick: :paper, result: :p2}],
      id: "1234",
      mode: Mode.get(:classic),
      players: {%Player{id: "1", name: "P1"}, %Player{id: "2", name: "P2"}},
      score: %Score{p1_score: 0, p2_score: 1, winner: :p2},
      type: Type.get(:best_of_1)
    }
  end
end
