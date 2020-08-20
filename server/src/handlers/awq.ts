import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'

class AwqHandler extends AbstractHandler {
  constructor(logger: Logger, emitter: Emitter) {
    super(logger, emitter)
  }

  start(socket: ISocket, exceptionHandler: Function) {

  }
}

export {AwqHandler}
