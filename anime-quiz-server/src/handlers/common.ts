import { Logger } from '../app/logging/logger';
import { HandlerDependencies, ServerConfig } from '../interfaces';
import { Oidc } from '../app/oidc';
import { UserDb } from '../database/user';
import { Socket } from '../types';
import { Emitter } from '../emitters/emitter';

class AbstractHandler {
  protected _logger: Logger;
  protected _socket: Socket;
  protected _config: ServerConfig;
  protected _oidc: Oidc;
  protected _userDb: UserDb;
  protected _errHandler: Function;
  protected _emitter: Emitter;

  constructor(socket: Socket, errHandler: Function, dependencies: HandlerDependencies) {
    this._logger = dependencies.logger;
    this._config = dependencies.config;
    this._oidc = dependencies.oidc;
    this._userDb = dependencies.userDb;
    this._emitter = dependencies.emitter;
    this._socket = socket;
    this._errHandler = errHandler;
  }

  public start() {
    throw new Error('not implemented');
  }
}

export { AbstractHandler };
