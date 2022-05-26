interface AqSong {
  anime_name: string[]
  anime_id: string
  song_id: string
  type: string
  artist: string
  song_title: string
  src: string
}

interface AqUserSongs {
  user_id: string
  username: string
  song_id: string[]
}

interface AqGameSettings {
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

interface AqGameState {
  playing: boolean
  currentSongCount: number
  maxSongCount: number
  startPosition: number
  gameList: AqSong[]
  songOverride: AqSong | null
  currentSong: AqSong
}

export {
  AqSong,
  AqUserSongs,
  AqGameSettings,
  AqGameChatMessage,
  AqClientData,
  AqGamePlayer,
  AqGameGuess,
  AqGameState
}
