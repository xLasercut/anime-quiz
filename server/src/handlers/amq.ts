import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {IRoomType} from '../../../shared/types/game'
import {AmqPlayer} from '../game/players/amq'
import {Server} from 'socket.io'
import {AmqRoomManager} from '../game/rooms/amq'

class AmqHandler extends AbstractHandler {
  protected _roomManager: AmqRoomManager
  protected _roomType: IRoomType = 'amq'

  constructor(io: Server, logger: Logger, emitter: Emitter, roomManager: AmqRoomManager) {
    super(logger, emitter)
    this._roomManager = roomManager
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LOGIN_AMQ_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._roomManager.newRoom(socket, roomName)
      socket.player = new AmqPlayer(username, avatar)
      let roomId = socket.roomId
      this._emitter.updateRoomList(this._roomManager.getRoomList())
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
    }))

    socket.on('LOGIN_AMQ_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      socket.player = new AmqPlayer(username, avatar)
      socket.roomId = roomId
      socket.join(roomId)
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      }
      //let roomId = socket.roomId
      //this._emitter.updateRoomList(this._roomManager.getRoomList())
      //this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      }
    }))
  }
}

export {AmqHandler}
