defmodule Roshambo.Game.Score do
  alias Roshambo.Game
  alias Roshambo.Game.{Hand, Type}

  @type winner() :: :p1 | :p2

  defstruct p1_score: 0, p2_score: 0, winner: nil
  @type t :: %__MODULE__{p1_score: pos_integer(), p2_score: pos_integer(), winner: winner()}

  def update(%Game{score: %__MODULE__{winner: winner}} = game) when not is_nil(winner), do: game

  def update(%Game{hands: hands} = game) do
    %{game | score: Enum.reduce(hands, %__MODULE__{}, &reduce_hand/2)}
  end

  def set_winner(%Game{score: %__MODULE__{winner: winner}} = game) when not is_nil(winner),
    do: game

  def set_winner(%Game{score: score, type: type} = game) do
    cond do
      p1_win?(type, score) -> %{game | score: %{score | winner: :p1}}
      p2_win?(type, score) -> %{game | score: %{score | winner: :p2}}
      true -> game
    end
  end

  defp reduce_hand(%Hand{result: :p1}, score), do: %{score | p1_score: score.p1_score + 1}
  defp reduce_hand(%Hand{result: :p2}, score), do: %{score | p2_score: score.p2_score + 1}
  defp reduce_hand(%Hand{result: :draw}, score), do: score

  defp p1_win?(%Type{games_to_win: num}, %__MODULE__{p1_score: score}), do: score == num
  defp p2_win?(%Type{games_to_win: num}, %__MODULE__{p2_score: score}), do: score == num
end
