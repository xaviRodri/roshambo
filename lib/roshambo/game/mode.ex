defmodule Roshambo.Game.Mode do
  alias Roshambo.Game.Hand

  defstruct [:name, :available_picks]
  @type t :: %__MODULE__{name: atom(), available_picks: list(Hand.pick())}

  def get(:classic), do: %__MODULE__{name: :classic, available_picks: [:rock, :paper, :scissors]}
  def get(_), do: nil
end
