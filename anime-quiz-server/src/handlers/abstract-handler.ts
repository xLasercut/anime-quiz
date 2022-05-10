import {Logger} from '../app/logging/logger'
import {Socket} from '../types'

class AbstractHandler {
  protected _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
  }

  public start(socket: Socket, errorHandler: Function): void {
    throw new Error('not implemented')
  }
}

export {
  AbstractHandler
}
