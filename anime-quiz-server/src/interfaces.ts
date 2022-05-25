import { AqGameSettingsSerialised } from './shared/interfaces'
import { GameSettings } from './game/settings'

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

interface AqGameRooms {
  [key: string]: {
    settings: GameSettings
  }
}

export {
  LogTemplate,
  AqSongRaw,
  AqAnimeRaw,
  AqUserSongsRaw,
  AqUserRaw,
  AqGameRooms
}
