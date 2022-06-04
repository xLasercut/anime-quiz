import { AqAnime, AqEmoji, AqGamePlayer, AqSong, AqUserSongs } from './shared/interfaces'

interface SongListStoreState {
  songList: AqSong[],
  animeList: string[]
  songTitleList: string[]
  userLists: AqUserSongs[]
}

interface AdminStoreState {
  animeList: AqAnime[]
  animeInEdit: AqAnime
  songList: AqSong[]
  songInEdit: AqSong
  emojiList: AqEmoji[]
  emojiInEdit: AqEmoji
}

interface RootStoreState {
  client: ClientStoreState,
  songList: SongListStoreState,
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
}

interface GameStoreState {
  players: AqGamePlayer[]
  currentSong: AqSong
  currentSongCount: number
  maxSongCount: number
  playing: boolean
  emojiList: AqEmoji[]
  disableSettings: boolean
}

export {
  SongListStoreState,
  RootStoreState,
  ClientStoreState,
  GameStoreState,
  AdminStoreState
}
