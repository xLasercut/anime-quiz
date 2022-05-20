interface AqSongSerialised {
  anime_name: string[]
  anime_id: string
  song_id: string
  type: string
  artist: string
  song_title: string
  src: string
}

interface AqUserSongsSerialised {
  user_id: string
  username: string
  song_id: string[]
}

export {
  AqSongSerialised,
  AqUserSongsSerialised
}
