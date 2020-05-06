import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'

class AbstractHandler {
  protected _logger: Logger
  protected _emitter: Emitter

  constructor(logger: Logger, emitter: Emitter) {
    this._logger = logger
    this._emitter = emitter
  }

  public start(socket: ISocket, exceptionHandler: Function): void {

  }
}

export {AbstractHandler}
