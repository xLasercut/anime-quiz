import { Server } from '../app/server';
import { ClientDataType, SystemNotificationType, UserIdType } from '../shared/models/types';
import { SOCKET_EVENTS } from '../shared/events';
import { EmitterDependencies } from '../interfaces';
import { UserDb } from '../database/user';
import { SongDb } from '../database/song';
import { EmojiDb } from '../database/emoji';
import { AnimeDb } from '../database/anime';
import { UserSongDb } from '../database/user-song';
import { GameRooms } from '../game-state/room';
import { Socket } from '../types';
import { GameChatSerialiser } from '../game-state/chat';

class Emitter {
  protected _io: Server;
  protected _userDb: UserDb;
  protected _songDb: SongDb;
  protected _emojiDb: EmojiDb;
  protected _animeDb: AnimeDb;
  protected _userSongDb: UserSongDb;
  protected _gameRooms: GameRooms;
  protected _chatSerialiser: GameChatSerialiser;

  constructor(io: Server, dependencies: EmitterDependencies) {
    this._io = io;
    this._userDb = dependencies.userDb;
    this._songDb = dependencies.songDb;
    this._emojiDb = dependencies.emojiDb;
    this._animeDb = dependencies.animeDb;
    this._userSongDb = dependencies.userSongDb;
    this._gameRooms = dependencies.gameRooms;
    this._chatSerialiser = dependencies.chatSerialiser;
  }

  public updateGameChat(socket: Socket, message: string, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_GAME_CHAT, this._chatSerialiser.generateUserMsg(socket, message));
  }

  public updateRoomList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_ROOM_LIST, this._gameRooms.getRoomList());
  }

  public systemNotification(notification: SystemNotificationType, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.SYSTEM_NOTIFICATION, notification);
  }

  public updateStoreClientData(clientData: ClientDataType, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, clientData);
  }

  public updateStoreSongList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_SONG_LIST, this._songDb.songList);
  }

  public updateStoreAnimeNames(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES, this._animeDb.animeNames);
  }

  public updateStoreSongTitles(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES, this._songDb.songTitles);
  }

  public updateStoreAnimeList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST, this._animeDb.animeList);
  }

  public updateStoreUserSongList(userId: UserIdType, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST, this._userSongDb.getUserSongList(userId));
  }

  public updateStoreEmojiList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST, this._emojiDb.emojiList);
  }

  public updateStoreUserList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST, this._userDb.getUserList());
  }

  protected _client(sid?: string) {
    if (sid) {
      return this._io.to(sid).compress(true);
    }
    return this._io.compress(true);
  }
}

export { Emitter };
