import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {GameRooms} from '../game/room'
import {IRoomType} from '../../../shared/types/game'
import {AmqPlayer, AmqPlayerManager} from '../game/players/amq'
import {Server} from 'socket.io'

class AmqHandler extends AbstractHandler {
  protected _rooms: GameRooms
  protected _roomType: IRoomType = 'amq'
  protected _amqPlayerManager: AmqPlayerManager

  constructor(io: Server, logger: Logger, emitter: Emitter, rooms: GameRooms) {
    super(logger, emitter)
    this._rooms = rooms
    this._amqPlayerManager = new AmqPlayerManager(io)
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LOGIN_AMQ_NEW', exceptionHandler(socket, (roomName: string) => {
      let roomId = this._rooms.newRoom(roomName, this._roomType)
      socket.roomId = roomId
      socket.player = new AmqPlayer('test', 'test')
      socket.join(roomId)
      this._emitter.updateRoomList(this._rooms.getRoomList())
      this._emitter.updateAmqPlayerList(this._amqPlayerManager.getPlayerList(roomId), roomId)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      console.log(socket)
    }))
  }
}

export {AmqHandler}
