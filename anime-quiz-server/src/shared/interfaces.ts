interface AqSong {
  anime_name: string[]
  anime_id: string[]
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
  guess: AqGameGuess
  scoreColor: string
  sid: string
}

interface AqGameGuess {
  anime: string
  title: string
}

interface AqGameState {
  currentSongCount: number
  maxSongCount: number
  playing: boolean
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
