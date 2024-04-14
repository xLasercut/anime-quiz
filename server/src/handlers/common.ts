import { THandlerDependencies, TServerConfig } from '../interfaces';
import { UserDb } from '../database/user';
import { Socket, SocketEvent } from '../types';
import { Emitter } from '../emitters/emitter';
import { SongDb } from '../database/song';
import { Oidc } from '../app/oidc';
import { AnimeDb } from '../database/anime';
import { UnauthorizedError } from '../app/exceptions';
import { DatabaseLock } from '../database/lock';
import { EmojiDb } from '../database/emoji';
import { UserSongDb } from '../database/user-song';
import { Server } from '../app/server';
import { TSocketEventName } from 'anime-quiz-shared-resources/src/types';
import { GameRooms } from '../game-state/room';
import { Logger } from 'winston';
import { DatabaseDataState } from '../database/common';
import { BotMessageDb } from '../database/bot-message';
import { GameChatSerialiser } from '../game-state/chat';
import { SongStatsDb } from '../database/song-stats';

abstract class ServerHandler {
  protected _logger: Logger;
  protected _config: TServerConfig;
  protected _userDb: UserDb;
  protected _emitter: Emitter;
  protected _songDb: SongDb;
  protected _animeDb: AnimeDb;
  protected _dbLock: DatabaseLock;
  protected _oidc: Oidc;
  protected _socket: Socket;
  protected _emojiDb: EmojiDb;
  protected _errHandler: Function;
  protected _userSongDb: UserSongDb;
  protected _botMessageDb: BotMessageDb;
  protected _songStatsDb: SongStatsDb;
  protected _io: Server;
  protected _gameRooms: GameRooms;
  protected _dbDataState: DatabaseDataState;
  protected _chatSerialiser: GameChatSerialiser;
  protected abstract _events: Record<TSocketEventName, SocketEvent>;

  protected constructor(socket: Socket, errHandler: Function, dependencies: THandlerDependencies) {
    this._socket = socket;
    this._errHandler = errHandler;
    this._logger = dependencies.logger;
    this._config = dependencies.config;
    this._userDb = dependencies.userDb;
    this._emitter = dependencies.emitter;
    this._songDb = dependencies.songDb;
    this._animeDb = dependencies.animeDb;
    this._oidc = dependencies.oidc;
    this._dbLock = dependencies.dbLock;
    this._emojiDb = dependencies.emojiDb;
    this._userSongDb = dependencies.userSongDb;
    this._botMessageDb = dependencies.botMessageDb;
    this._songStatsDb = dependencies.songStatsDb;
    this._io = dependencies.io;
    this._gameRooms = dependencies.gameRooms;
    this._dbDataState = dependencies.dbDataState;
    this._chatSerialiser = dependencies.chatSerialiser;
  }

  public start(): void {
    for (const [eventName, eventFunction] of Object.entries(this._events)) {
      this._socket.on(eventName, this._errHandler(eventFunction));
    }
  }

  protected _validateCanWriteDbNonAdmin() {
    this._dbLock.validateNotLocked();
    this._userDb.validateAllowedUser(this._socket.data.clientData.discordId);
  }

  protected _validateCanWriteDbAdmin() {
    this._dbLock.validateNotLocked();
    this._userDb.validateAllowedUser(this._socket.data.clientData.discordId);
    this._validateIsAdmin();
  }

  protected _validateIsAdmin(): void {
    if (!this._socket.data.clientData.admin) {
      throw new UnauthorizedError();
    }
  }
}

export { ServerHandler };
