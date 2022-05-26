import { AqGamePlayer, AqSong, AqUserSongs } from './shared/interfaces'

interface SongListStoreState {
  songList: AqSong[],
  currentPage: number
  itemsPerPage: number
  animeFilter: string
  songTypeFilter: string
  songTitleFilter: string
  animeList: string[]
  songTitleList: string[]
  userLists: AqUserSongs[]
}

interface RootStoreState {
  client: ClientStoreState,
  songList: SongListStoreState
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
}

export {
  SongListStoreState,
  RootStoreState,
  ClientStoreState,
  GameStoreState
}
