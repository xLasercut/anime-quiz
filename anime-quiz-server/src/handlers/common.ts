import { Logger } from '../app/logging/logger';
import { HandlerDependencies, ServerConfig } from '../interfaces';
import { UserDb } from '../database/user';
import { Socket, SocketEvent } from '../types';
import { Emitter } from '../emitters/emitter';
import { SongDb } from '../database/song';
import { Oidc } from '../app/oidc';

abstract class AbstractHandler {
  protected _logger: Logger;
  protected _config: ServerConfig;
  protected _userDb: UserDb;
  protected _emitter: Emitter;
  protected _songDb: SongDb;
  protected _oidc: Oidc;
  protected _socket: Socket;
  protected _errHandler: Function;
  protected abstract _events: { [key: string]: SocketEvent };

  protected constructor(socket: Socket, errHandler: Function, dependencies: HandlerDependencies) {
    this._socket = socket;
    this._errHandler = errHandler;
    this._logger = dependencies.logger;
    this._config = dependencies.config;
    this._userDb = dependencies.userDb;
    this._emitter = dependencies.emitter;
    this._songDb = dependencies.songDb;
    this._oidc = dependencies.oidc;
  }

  public start(): void {
    for (const [eventName, eventFunction] of Object.entries(this._events)) {
      this._socket.on(eventName, this._errHandler(eventFunction));
    }
  }
}

export { AbstractHandler };
