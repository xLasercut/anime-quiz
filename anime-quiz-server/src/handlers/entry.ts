import { AbstractHandler } from './common';
import { Socket } from '../types';
import { SOCKET_EVENTS } from '../shared/events';
import { LOG_REFERENCES } from '../app/logging/constants';
import { UserHandler } from './user';
import { SongHandler } from './song';
import { DataHandler } from './data';
import { HandlerDependencies, ServerConfig } from '../interfaces';
import { AdminUserHandler } from './admin-user';
import { UnauthorizedError } from '../app/exceptions';
import { AdminAnimeHandler } from './admin-anime';

class EntryPointHandler extends AbstractHandler {
  protected _handlers: AbstractHandler[];
  protected _adminHandlers: AbstractHandler[];
  protected _events = {
    [SOCKET_EVENTS.AUTHORIZE_USER]: async (code: string, callback: Function) => {
      const discordUser = await this._oidc.getUserInfo(code);
      this._userDb.validateAllowedUser(discordUser.id);
      const dbUser = this._userDb.getUserInfo(discordUser.id);
      this._socket.data.initClientData(dbUser);
      this._setClientData();
      this._startHandler();
      callback(true);
    },
    [SOCKET_EVENTS.DISCONNECT]: () => {
      this._logger.writeLog(LOG_REFERENCES.CLIENT_DISCONNECTED, { id: this._socket.id });
      clearTimeout(this._socket.data.clientAuthTimer);
    }
  };

  constructor(socket: Socket, errHandler: Function, dependencies: HandlerDependencies) {
    super(socket, errHandler, dependencies);
    this._handlers = [
      new UserHandler(socket, errHandler, dependencies),
      new SongHandler(socket, errHandler, dependencies),
      new DataHandler(socket, errHandler, dependencies)
    ];
    this._adminHandlers = [new AdminUserHandler(socket, errHandler, dependencies), new AdminAnimeHandler(socket, errHandler, dependencies)];
    this._socket.data.clientAuthTimer = setTimeout(
      this._errHandler(() => {
        this._checkClientAuth();
      }),
      this._config.clientAuthDelay
    );
  }

  protected _setClientData(): void {
    this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
    this._emitter.updateStoreSongTitles(this._songDb.getSongTitles(), this._socket.id);
    this._emitter.updateStoreAnimeNames(this._animeDb.getAnimeNames(), this._socket.id);
    this._emitter.updateStoreSongList(this._songDb.getSongList(), this._socket.id);
    this._emitter.updateStoreAnimeList(this._animeDb.getAnimeList(), this._socket.id);
    this._emitter.updateStoreUserSongList(this._userDb.getUserSongList(this._socket.data.clientData.discordId), this._socket.id);
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
