import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { GameController } from '../game/controller'
import { Emitter } from '../app/emitter'

class RoomHandler extends AbstractHandler {
  protected _controller: GameController
  protected _emitter: Emitter

  constructor(logger: Logger, controller: GameController, emitter: Emitter) {
    super(logger)
    this._controller = controller
    this._emitter = emitter
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.LEAVE_ALL_ROOMS, () => {
      try {
        for (const roomId in socket.rooms) {
          if (roomId !== socket.id) {
            socket.leave(roomId)
          }
        }
        this._controller.syncRoomStates()
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_ROOM_LIST, () => {
      try {
        this._emitter.updateRoomList(this._controller.getRoomList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  RoomHandler
}
