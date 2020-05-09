import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {GameRooms} from '../game/room'

class RoomHandler extends AbstractHandler {
  protected _rooms: GameRooms

  constructor(logger: Logger, emitter: Emitter, rooms: GameRooms) {
    super(logger, emitter)
    this._rooms = rooms
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('GET_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._emitter.updateRoomList(this._rooms.getRoomList(), socket.id)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      socket.leaveAll()
    }))
  }
}

export {RoomHandler}
