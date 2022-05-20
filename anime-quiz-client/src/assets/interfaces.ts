import { AqSongSerialised, AqUserSongsSerialised } from './shared/interfaces'

interface SongListStoreState {
  songList: AqSongSerialised[],
  currentPage: number
  itemsPerPage: number
  animeFilter: string
  songTypeFilter: string
  songTitleFilter: string
  animeList: string[]
  songTitleList: string[]
  userLists: AqUserSongsSerialised[]
}

interface RootStoreState {
  client: ClientStoreState,
  songList: SongListStoreState
}

interface ClientStoreState {
  view: string
  dialogView: string
}

export {
  SongListStoreState,
  RootStoreState,
  ClientStoreState
}
