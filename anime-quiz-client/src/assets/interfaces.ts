import {AqAnimeSerialised, AqSongSerialised} from './shared/interfaces'

interface SongListStoreState {
  songList: AqSongSerialised[],
  currentPage: number
  itemsPerPage: number
  animeFilter: string
  animeList: AqAnimeSerialised[]
}

interface RootStoreState {
  client: ClientStoreState,
  songList: SongListStoreState
}

interface ClientStoreState {
  darkTheme: boolean
  view: string
  dialogView: string
}

export {
  SongListStoreState,
  RootStoreState,
  ClientStoreState
}
