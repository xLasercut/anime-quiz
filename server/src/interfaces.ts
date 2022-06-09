import { AqSong } from './shared/interfaces'

interface LogTemplate {
  reference: string
  level: string
  message: string
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

interface AqUserSongsRaw {
  user_id: string
  song_id: string
  username: string
}

interface AqGameStateRaw {
  playing: boolean
  currentSongCount: number
  startPosition: number
  gameList: AqSong[]
  songOverride: AqSong | null
  countdown: NodeJS.Timer
  timeout: NodeJS.Timeout
  currentSong: AqSong
}

interface AqAnimeRaw {
  anime_id: string
  anime_name: string
}

export {
  LogTemplate,
  AqSongRaw,
  AqUserSongsRaw,
  AqGameStateRaw,
  AqAnimeRaw
}
