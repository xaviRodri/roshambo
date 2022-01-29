defmodule Roshambo.Game.Type do
  @enforce_keys [:name, :games_to_win]
  defstruct [:name, :games_to_win]
  @type t :: %__MODULE__{name: atom(), games_to_win: non_neg_integer()}

  def get_all, do: ["Best of 1": :best_of_1, "Best of 3": :best_of_3, "Best of 5": :best_of_5]

  def get(:best_of_1), do: %__MODULE__{name: :best_of_1, games_to_win: 1}
  def get(:best_of_3), do: %__MODULE__{name: :best_of_3, games_to_win: 2}
  def get(:best_of_5), do: %__MODULE__{name: :best_of_5, games_to_win: 3}
  def get(type) when is_binary(type), do: type |> String.to_atom() |> get()
  def get(_), do: nil
end
