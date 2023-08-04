import { Server } from '../app/server';
import {
  AnimeNameType,
  AnimeType,
  ClientDataType,
  EmojiType,
  SongIdType,
  SongTitleType,
  SongType,
  SystemNotificationType,
  UserType
} from '../shared/models/types';
import { SOCKET_EVENTS } from '../shared/events';

class Emitter {
  protected _io: Server;

  constructor(io: Server) {
    this._io = io;
  }

  public systemNotification(notification: SystemNotificationType, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.SYSTEM_NOTIFICATION, notification);
  }

  public updateStoreClientData(clientData: ClientDataType, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, clientData);
  }

  public updateStoreSongList(songList: SongType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_SONG_LIST, songList);
  }

  public updateStoreAnimeNames(animeNames: AnimeNameType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES, animeNames);
  }

  public updateStoreSongTitles(songTitles: SongTitleType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES, songTitles);
  }

  public updateStoreAnimeList(animeList: AnimeType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST, animeList);
  }

  public updateStoreUserSongList(userSongList: SongIdType[], sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST, userSongList);
  }

  public updateStoreEmojiList(emojiList: EmojiType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST, emojiList);
  }

  public updateStoreUserList(userList: UserType[], sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST, userList);
  }

  protected _client(sid?: string) {
    if (sid) {
      return this._io.to(sid).compress(true);
    }
    return this._io.compress(true);
  }
}

export { Emitter };
