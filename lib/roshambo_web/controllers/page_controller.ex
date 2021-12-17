defmodule RoshamboWeb.PageController do
  use RoshamboWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
