import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {MasterRoomManager} from '../game/rooms/master'

class RoomHandler extends AbstractHandler {
  protected _roomManager: MasterRoomManager

  constructor(logger: Logger, emitter: Emitter, roomManager: MasterRoomManager) {
    super(logger, emitter)
    this._roomManager = roomManager
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('GET_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._emitter.updateRoomList(this._roomManager.getRoomList(), socket.id)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      socket.leaveAll()
      this._emitter.updateRoomList(this._roomManager.getRoomList())
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._emitter.updateRoomList(this._roomManager.getRoomList())
    }))
  }
}

export {RoomHandler}
