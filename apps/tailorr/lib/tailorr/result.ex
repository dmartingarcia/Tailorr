defmodule Tailorr.Result do
  @moduledoc """
  Normalized search result from a tracker.

  This struct represents a single torrent search result with all metadata
  normalized to consistent formats. It's the internal representation that
  gets converted to Torznab/Newznab XML when serving API responses.
  """

  @type t :: %__MODULE__{
          tracker_id: String.t(),
          title: String.t(),
          download_url: String.t() | nil,
          magnet_url: String.t() | nil,
          detail_url: String.t() | nil,
          size_bytes: integer() | nil,
          seeders: integer() | nil,
          leechers: integer() | nil,
          category: String.t() | nil,
          published_at: DateTime.t() | nil,
          quality: String.t() | nil,
          raw_data: map()
        }

  defstruct [
    :tracker_id,
    :title,
    :download_url,
    :magnet_url,
    :detail_url,
    :size_bytes,
    :seeders,
    :leechers,
    :category,
    :published_at,
    :quality,
    raw_data: %{}
  ]

  @doc """
  Create a new Result from parsed HTML data.
  """
  def new(attrs) do
    struct(__MODULE__, attrs)
  end

  @doc """
  Validate that a result has minimum required fields.
  At minimum, a result needs a title and either a download_url or magnet_url.
  """
  def valid?(%__MODULE__{title: nil}), do: false
  def valid?(%__MODULE__{title: ""}), do: false

  def valid?(%__MODULE__{download_url: nil, magnet_url: nil}), do: false
  def valid?(%__MODULE__{download_url: "", magnet_url: ""}), do: false

  def valid?(%__MODULE__{}), do: true
end
