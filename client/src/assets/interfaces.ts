import { AqAnime, AqEmoji, AqGamePlayer, AqSong, AqUserSongs } from './shared/interfaces'

interface DataStoreState {
  songList: AqSong[],
  animeList: AqAnime[]
  songTitleList: string[]
  userLists: AqUserSongs[]
  emojiList: AqEmoji[]
}

interface AdminStoreState {
  animeInEdit: AqAnime
  songInEdit: AqSong
  emojiInEdit: AqEmoji
  userInEdit: AqUserSongs
}

interface RootStoreState {
  client: ClientStoreState,
  data: DataStoreState,
  game: GameStoreState,
  admin: AdminStoreState
}

interface ClientStoreState {
  view: string
  dialogView: string
  username: string
  avatar: string
  admin: boolean
  host: boolean
  volume: number
}

interface GameStoreState {
  players: AqGamePlayer[]
  currentSong: AqSong
  currentSongCount: number
  maxSongCount: number
  playing: boolean
  disableSettings: boolean
}

export {
  DataStoreState,
  RootStoreState,
  ClientStoreState,
  GameStoreState,
  AdminStoreState
}
