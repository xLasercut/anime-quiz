import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'

class GeneralGameHandler extends AbstractHandler {

  constructor(logger: Logger, emitter: Emitter) {
    super(logger, emitter)
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LEAVE_ALL_ROOM', exceptionHandler(socket, (): void => {
      for (let roomId in socket.rooms) {
        if (roomId !== socket.id) {
          socket.leave(roomId)
        }
      }
    }))
  }
}

export {GeneralGameHandler}
