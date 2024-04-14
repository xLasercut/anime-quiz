import { Server } from '../app/server';
import {
  TClientData,
  TGameChat,
  TGameGuess,
  TGamePlayerLifeLineType,
  TGameRoomSettings,
  TSystemNotification,
  TUserId
} from 'anime-quiz-shared-resources/src/models/types';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TEmitterDependencies } from '../interfaces';
import { UserDb } from '../database/user';
import { SongDb } from '../database/song';
import { EmojiDb } from '../database/emoji';
import { AnimeDb } from '../database/anime';
import { UserSongDb } from '../database/user-song';
import { GameRooms } from '../game-state/room';
import { GameChatSerialiser } from '../game-state/chat';
import { DatabaseDataState } from '../database/common';
import { BotMessageDb } from '../database/bot-message';
import { SongStatsDb } from '../database/song-stats';

class Emitter {
  protected _io: Server;
  protected _userDb: UserDb;
  protected _songDb: SongDb;
  protected _emojiDb: EmojiDb;
  protected _animeDb: AnimeDb;
  protected _userSongDb: UserSongDb;
  protected _botMessageDb: BotMessageDb;
  protected _songStatsDb: SongStatsDb;
  protected _gameRooms: GameRooms;
  protected _chatSerialiser: GameChatSerialiser;
  protected _dbDataState: DatabaseDataState;

  constructor(io: Server, dependencies: TEmitterDependencies) {
    this._io = io;
    this._userDb = dependencies.userDb;
    this._songDb = dependencies.songDb;
    this._emojiDb = dependencies.emojiDb;
    this._animeDb = dependencies.animeDb;
    this._userSongDb = dependencies.userSongDb;
    this._botMessageDb = dependencies.botMessageDb;
    this._songStatsDb = dependencies.songStatsDb;
    this._gameRooms = dependencies.gameRooms;
    this._chatSerialiser = dependencies.chatSerialiser;
    this._dbDataState = dependencies.dbDataState;
  }

  public gameShowLifeLine(lifeLineType: TGamePlayerLifeLineType, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE, lifeLineType);
  }

  public gameShowGuess(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.GAME_SHOW_GUESS);
  }

  public gameStartCountdown(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  }

  public gameStartLoad(sid: string, startPosition: number, guessTime: number) {
    this._client(sid).emit(SOCKET_EVENTS.GAME_START_LOAD, startPosition, guessTime);
  }

  public gameNewRound(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.GAME_NEW_ROUND);
  }

  public startGame(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.START_GAME);
  }

  public stopGame(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.STOP_GAME);
  }

  public updateStoreGameState(sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_GAME_STATE, this._gameRooms.getRoom(sid).state.dict);
  }

  public updateGameChat(gameChat: TGameChat, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_GAME_CHAT, gameChat);
  }

  public updateRoomList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_ROOM_LIST, this._gameRooms.getRoomList());
  }

  public systemNotification(notification: TSystemNotification, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.SYSTEM_NOTIFICATION, notification);
  }

  public updateStoreClientData(clientData: TClientData, sid: string) {
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

  public updateStoreUserSongList(userId: TUserId, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST, this._userSongDb.getUserSongList(userId));
  }

  public updateStoreEmojiList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST, this._emojiDb.emojiList);
  }

  public updateStoreUserList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST, this._userDb.getUserList());
  }

  public updateStoreBotMessageList(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_BOT_MESSAGE_LIST, this._botMessageDb.messageList);
  }

  public updateStoreSongStatsRecords(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_SONG_STATS_RECORDS, this._songStatsDb.getSongStatsRecords());
  }

  public updateStoreDataVersion(sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_DATA_VERSION, this._dbDataState.dataVersion);
  }

  public updateGameRoomSettings(settings: TGameRoomSettings, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_CLIENT_GAME_ROOM_SETTINGS, settings);
  }

  public updateStorePlayerList(roomId: string) {
    this._client(roomId).emit(SOCKET_EVENTS.UPDATE_STORE_PLAYER_LIST, this._gameRooms.getPlayerList(roomId));
  }

  public updateStoreGameGuess(guess: TGameGuess, sid: string) {
    this._client(sid).emit(SOCKET_EVENTS.UPDATE_STORE_GAME_GUESS, guess);
  }

  protected _client(sid?: string) {
    if (sid) {
      return this._io.to(sid).compress(true);
    }
    return this._io.compress(true);
  }
}

export { Emitter };
