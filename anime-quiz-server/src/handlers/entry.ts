import { ServerHandler } from './common';
import { Socket } from '../types';
import { SOCKET_EVENTS } from '../shared/events';
import { UserHandler } from './user';
import { DataHandler } from './data';
import { HandlerDependencies } from '../interfaces';
import { AdminUserHandler } from './admin-user';
import { UnauthorizedError } from '../app/exceptions';
import { AdminAnimeHandler } from './admin-anime';
import { AdminSongHandler } from './admin-song';
import { AdminEmojiHandler } from './admin-emoji';
import { GameRoomsHandler } from './game-rooms';

class EntryPointHandler extends ServerHandler {
  protected _handlers: ServerHandler[];
  protected _adminHandlers: ServerHandler[];
  protected _events = {
    [SOCKET_EVENTS.AUTHORIZE_USER]: async (code: string, callback: Function) => {
      this._logger.info('authenticating client', {
        id: this._socket.id,
        code: code
      });
      const discordUser = await this._oidc.getUserInfo(code);
      this._userDb.validateAllowedUser(discordUser.id);
      const dbUser = this._userDb.getUserInfo(discordUser.id);
      this._socket.data.initClientData(dbUser);
      this._setClientData();
      this._startHandler();
      callback(true);
    },
    [SOCKET_EVENTS.DISCONNECT]: () => {
      this._logger.info('client disconnected', { id: this._socket.id });
      clearTimeout(this._socket.data.clientAuthTimer);
    }
  };

  constructor(socket: Socket, errHandler: Function, dependencies: HandlerDependencies) {
    super(socket, errHandler, dependencies);
    this._handlers = [
      new UserHandler(socket, errHandler, dependencies),
      new DataHandler(socket, errHandler, dependencies),
      new GameRoomsHandler(socket, errHandler, dependencies)
    ];
    this._adminHandlers = [
      new AdminUserHandler(socket, errHandler, dependencies),
      new AdminAnimeHandler(socket, errHandler, dependencies),
      new AdminSongHandler(socket, errHandler, dependencies),
      new AdminEmojiHandler(socket, errHandler, dependencies)
    ];
    this._socket.data.clientAuthTimer = setTimeout(
      this._errHandler(() => {
        this._checkClientAuth();
      }),
      this._config.clientAuthDelay
    );
  }

  protected _setClientData(): void {
    this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
    this._emitter.updateStoreSongTitles(this._socket.id);
    this._emitter.updateStoreAnimeNames(this._socket.id);
    this._emitter.updateStoreSongList(this._socket.id);
    this._emitter.updateStoreAnimeList(this._socket.id);
    this._emitter.updateStoreUserSongList(this._socket.data.clientData.userId, this._socket.id);
    this._emitter.updateStoreEmojiList(this._socket.id);
  }

  protected _startHandler(): void {
    for (const handler of this._handlers) {
      handler.start();
    }
    if (this._socket.data.clientData.admin) {
      for (const handler of this._adminHandlers) {
        handler.start();
      }
    }
  }

  protected _checkClientAuth() {
    if (!this._socket.data.clientData.auth) {
      throw new UnauthorizedError();
    }
  }
}

export { EntryPointHandler };
