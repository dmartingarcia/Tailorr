defmodule Tailorr.Repo.Migrations.CreateTelegramChats do
  use Ecto.Migration

  def change do
    create table(:telegram_chats) do
      add :chat_id, :integer, null: false
      add :first_name, :string
      add :username, :string
      timestamps(updated_at: false)
    end

    create unique_index(:telegram_chats, [:chat_id])
  end
end
