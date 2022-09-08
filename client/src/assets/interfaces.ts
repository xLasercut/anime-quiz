import { IAnime, IEmoji, IGamePlayer, ISong, IUserSongs } from './shared/interfaces';

interface DataStoreState {
  songList: ISong[];
  animeList: IAnime[];
  songTitleList: string[];
  userLists: IUserSongs[];
  emojiList: IEmoji[];
}

interface AdminStoreState {
  animeInEdit: IAnime;
  songInEdit: ISong;
  emojiInEdit: IEmoji;
  userInEdit: IUserSongs;
}

interface RootStoreState {
  client: ClientStoreState;
  data: DataStoreState;
  game: GameStoreState;
  admin: AdminStoreState;
}

interface ClientStoreState {
  view: string;
  dialogView: string;
  username: string;
  avatar: string;
  admin: boolean;
  host: boolean;
  volume: number;
}

interface GameStoreState {
  players: IGamePlayer[];
  currentSong: ISong;
  currentSongCount: number;
  maxSongCount: number;
  playing: boolean;
  disableSettings: boolean;
}

export { DataStoreState, RootStoreState, ClientStoreState, GameStoreState, AdminStoreState };
