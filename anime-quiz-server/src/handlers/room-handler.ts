import { AbstractHandler } from './abstract-handler'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'

class RoomHandler extends AbstractHandler {
  constructor(logger: Logger) {
    super(logger)
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.LEAVE_ALL_ROOMS, () => {
      try {
        for (const roomId in socket.rooms) {
          if (roomId !== socket.id) {
            socket.leave(roomId)
          }
        }
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  RoomHandler
}
