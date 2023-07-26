import { Logger } from '../app/logging/logger';
import { HandlerDependencies, ServerConfig } from '../interfaces';
import { Oidc } from '../app/oidc';
import { UserDb } from '../database/user';
import { socketErrorHandler } from '../app/exceptions';
import { Socket } from '../types';

class AbstractHandler {
  protected _logger: Logger;
  protected _socket: Socket;
  protected _config: ServerConfig;
  protected _oidc: Oidc;
  protected _userDb: UserDb;
  protected _errHandler: Function;

  constructor(socket: Socket, dependencies: HandlerDependencies) {
    this._logger = dependencies.logger;
    this._config = dependencies.config;
    this._oidc = dependencies.oidc;
    this._userDb = dependencies.userDb;
    this._socket = socket;
    this._errHandler = socketErrorHandler(this._logger, this._socket);
  }

  public start() {
    throw new Error('not implemented');
  }
}

export { AbstractHandler };
