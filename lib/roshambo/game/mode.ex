defmodule Roshambo.Game.Mode do
  alias Roshambo.Game.Hand

  defstruct [:name, :available_picks]
  @type t :: %__MODULE__{name: atom(), available_picks: list(Hand.pick())}

  def get_all, do: [Classic: :classic]

  def get(:classic), do: %__MODULE__{name: :classic, available_picks: [:rock, :paper, :scissors]}
  def get(mode) when is_binary(mode), do: mode |> String.to_atom() |> get()
  def get(_), do: nil
end
