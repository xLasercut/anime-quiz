interface LogTemplate {
  reference: string
  level: string
  template: string
}

interface AqSongRaw {
  anime_name: string
  anime_id: string
  song_id: string
  type: string
  artist: string
  song_title: string
  src: string
}

export {
  LogTemplate,
  AqSongRaw
}
