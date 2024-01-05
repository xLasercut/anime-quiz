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
import { ChatHandler } from './chat';
import { ClientLoginAuthType } from '../shared/models/types';
import { ClientLoginAuth } from '../shared/models/client';
import { GameHandler } from './game';
import { AdminGameHandler } from './admin-game';
import { AdminGeneralHandler } from './admin-general';

class EntryPointHandler extends ServerHandler {
  protected _handlers: ServerHandler[];
  protected _adminHandlers: ServerHandler[];
  protected _events = {
    [SOCKET_EVENTS.AUTHORIZE_USER]: async (_clientLoginAuth: ClientLoginAuthType, callback: Function) => {
      this._logger.info('authenticating client', {
        id: this._socket.id,
        clientLoginAuth: _clientLoginAuth
      });
      const clientLoginAuth = ClientLoginAuth.parse(_clientLoginAuth);
      const discordUser = await this._oidc.getUserInfo(clientLoginAuth.code);
      this._userDb.validateAllowedUser(discordUser.id);
      const dbUser = this._userDb.getUserInfo(discordUser.id);
      this._socket.data.initClientData(dbUser);
      this._setClientData(clientLoginAuth.dataVersion);
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
      new GameRoomsHandler(socket, errHandler, dependencies),
      new ChatHandler(socket, errHandler, dependencies),
      new GameHandler(socket, errHandler, dependencies)
    ];
    this._adminHandlers = [
      new AdminUserHandler(socket, errHandler, dependencies),
      new AdminAnimeHandler(socket, errHandler, dependencies),
      new AdminSongHandler(socket, errHandler, dependencies),
      new AdminEmojiHandler(socket, errHandler, dependencies),
      new AdminGameHandler(socket, errHandler, dependencies),
      new AdminGeneralHandler(socket, errHandler, dependencies)
    ];
    this._socket.data.clientAuthTimer = setTimeout(
      this._errHandler(() => {
        this._checkClientAuth();
      }),
      this._config.clientAuthDelay
    );
  }

  protected _setClientData(dataVersion: string): void {
    this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
    this._emitter.updateStoreUserSongList(this._socket.data.clientData.userId, this._socket.id);
    if (this._dbDataState.dataVersion !== dataVersion) {
      this._emitter.updateStoreSongTitles(this._socket.id);
      this._emitter.updateStoreAnimeNames(this._socket.id);
      this._emitter.updateStoreSongList(this._socket.id);
      this._emitter.updateStoreAnimeList(this._socket.id);
      this._emitter.updateStoreEmojiList(this._socket.id);
      this._emitter.updateStoreDataVersion(this._socket.id);
    }
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
