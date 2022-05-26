import { GameSettings } from './game/settings'

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

interface AqAnimeRaw {
  anime_id: string
  anime_name: string
}

interface AqUserSongsRaw {
  user_id: string
  song_id: string
  username: string
}

interface AqUserRaw {
  user_id: string
  username: string
}

export {
  LogTemplate,
  AqSongRaw,
  AqAnimeRaw,
  AqUserSongsRaw,
  AqUserRaw
}
