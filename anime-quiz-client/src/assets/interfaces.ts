import { AqAnime, AqGamePlayer, AqSong, AqUserSongs } from './shared/interfaces'

interface SongListStoreState {
  songList: AqSong[],
  animeList: AqAnime[]
  songTitleList: string[]
  userLists: AqUserSongs[]
}

interface RootStoreState {
  client: ClientStoreState,
  songList: SongListStoreState,
  game: GameStoreState
}

interface ClientStoreState {
  view: string
  dialogView: string
  username: string
  avatar: string
  admin: boolean
  host: boolean
}

interface GameStoreState {
  players: AqGamePlayer[]
  currentSong: AqSong
  currentSongCount: number
  maxSongCount: number
  playing: boolean
}

export {
  SongListStoreState,
  RootStoreState,
  ClientStoreState,
  GameStoreState
}
