import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Emitter } from '../app/emitter'
import { Server } from '../app/server'

class RoomHandler extends AbstractHandler {
  protected _io: Server

  constructor(logger: Logger, io: Server, emitter: Emitter) {
    super(logger, emitter)
    this._io = io
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.LEAVE_ALL_ROOMS, () => {
      try {
        for (const roomId of Array.from(socket.rooms)) {
          if (roomId !== socket.id) {
            socket.leave(roomId)
          }
        }
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_ROOM_LIST, () => {
      try {
        this._emitter.updateRoomList(this._io.getGameRoomList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  RoomHandler
}
