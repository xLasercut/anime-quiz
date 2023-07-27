import { Logger } from '../app/logging/logger';
import { HandlerDependencies, ServerConfig } from '../interfaces';
import { UserDb } from '../database/user';
import { Socket } from '../types';
import { Emitter } from '../emitters/emitter';
import { SongDb } from '../database/song';

class AbstractHandler {
  protected _logger: Logger;
  protected _config: ServerConfig;
  protected _userDb: UserDb;
  protected _emitter: Emitter;
  protected _songDb: SongDb;

  constructor(dependencies: HandlerDependencies) {
    this._logger = dependencies.logger;
    this._config = dependencies.config;
    this._userDb = dependencies.userDb;
    this._emitter = dependencies.emitter;
    this._songDb = dependencies.songDb;
  }

  public start(socket: Socket, errHandler: Function): void {
    throw new Error('not implemented');
  }
}

export { AbstractHandler };
