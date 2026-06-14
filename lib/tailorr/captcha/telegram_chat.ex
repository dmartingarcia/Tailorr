defmodule Tailorr.Captcha.TelegramChat do
  use Ecto.Schema
  import Ecto.Changeset

  schema "telegram_chats" do
    field(:chat_id, :integer)
    field(:first_name, :string)
    field(:username, :string)
    timestamps(updated_at: false)
  end

  def changeset(chat, attrs) do
    chat
    |> cast(attrs, [:chat_id, :first_name, :username])
    |> validate_required([:chat_id])
    |> unique_constraint(:chat_id)
  end
end
