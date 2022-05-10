interface AqSongSerialised {
  anime_name: string[]
  anime_id: string
  song_id: string
  type: string
  artist: string
  song_title: string
  src: string
}

interface AqAnimeSerialised {
  anime_id: string
  anime_name: string
}

export {
  AqSongSerialised,
  AqAnimeSerialised
}
