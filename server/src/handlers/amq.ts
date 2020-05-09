import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {GameRooms} from '../game/room'
import {IRoomType} from '../../../shared/types/game'

class AmqHandler extends AbstractHandler {
  protected _rooms: GameRooms
  protected _roomType: IRoomType = 'amq'

  constructor(logger: Logger, emitter: Emitter, rooms: GameRooms) {
    super(logger, emitter)
    this._rooms = rooms
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LOGIN_AMQ_NEW', exceptionHandler(socket, (roomName: string) => {
      let roomId = this._rooms.newRoom(roomName, this._roomType)
      this._emitter.updateRoomList(this._rooms.getRoomList())
      console.log(roomId)
    }))
  }
}

export {AmqHandler}
