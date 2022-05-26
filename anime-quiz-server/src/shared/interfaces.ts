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

interface AqGameSettingsSerialised {
  songCount: number
  guessTime: number
  gameMode: string
  duplicate: boolean
  users: string[]
}

interface AqGameChatMessage {
  username: string
  text: string
  avatar: string
  sid: string
  repeat: boolean
  admin: boolean
}

interface AqClientData {
  username: string
  avatar: string
  admin: boolean
  host: boolean
}

interface AqGamePlayer {
  username: string
  avatar: string
  admin: boolean
  host: boolean
  score: number
}

interface AqGameGuess {
  anime: string
  title: string
}

export {
  AqSongSerialised,
  AqUserSongsSerialised,
  AqGameSettingsSerialised,
  AqGameChatMessage,
  AqClientData,
  AqGamePlayer,
  AqGameGuess
}
