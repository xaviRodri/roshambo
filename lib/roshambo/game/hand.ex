defmodule Roshambo.Game.Hand do
  @type pick() :: :rock | :paper | :scissors
  @type result() :: :p1 | :p2 | :draw

  defstruct [:p1_pick, :p2_pick, :result]
  @type t :: %__MODULE__{p1_pick: pick(), p2_pick: pick(), result: result()}

  @doc """
  Resolves a hand and puts a result in it.

  Results available are:

  * Player 1 wins
  * Player 2 wins
  * Draw
  """
  @spec resolve(__MODULE__.t()) :: __MODULE__.t()
  def resolve(%__MODULE__{p1_pick: p1_pick, p2_pick: p2_pick} = hand)
      when is_nil(p1_pick) or is_nil(p2_pick),
      do: hand

  def resolve(%__MODULE__{p1_pick: p1_pick, p2_pick: p2_pick} = hand),
    do: %{hand | result: shot(p1_pick, p2_pick)}

  @spec shot(pick(), pick()) :: result()
  defp shot(p1_pick, p2_pick) when p1_pick == p2_pick, do: :draw
  defp shot(:rock, :paper), do: :p2
  defp shot(:rock, :scissors), do: :p1
  defp shot(:paper, :rock), do: :p1
  defp shot(:paper, :scissors), do: :p2
  defp shot(:scissors, :rock), do: :p2
  defp shot(:scissors, :paper), do: :p1
end
