import {AbstractHandler} from './abstract'
import {Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {MasterRoomManager} from '../game/rooms/master'
import {ChatManager} from '../game/chat'

class RoomHandler extends AbstractHandler {
  protected _roomManager: MasterRoomManager
  protected _chatManager: ChatManager

  constructor(logger: Logger, emitter: Emitter, roomManager: MasterRoomManager, chatManager: ChatManager) {
    super(logger, emitter)
    this._roomManager = roomManager
    this._chatManager = chatManager
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('GET_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._emitter.updateRoomList(this._roomManager.getRoomList(), socket.id)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      socket.leave(socket.roomId)
      this._emitter.updateRoomList(this._roomManager.getRoomList())
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._emitter.updateRoomList(this._roomManager.getRoomList())
    }))

    socket.on('PLAYER_CHAT', exceptionHandler(socket, (msg: string): void => {
      let player = socket.player.serialize()
      let roomId = socket.roomId
      this._emitter.sendChat(this._chatManager.generateUserMsg(
        socket.id,
        player.username,
        player.admin,
        player.avatar,
        msg
      ), roomId)
      let botMsg = this._chatManager.generateBotMsg(msg)
      if (botMsg) {
        this._emitter.sendChat(botMsg, roomId)
      }
    }))
  }
}

export {RoomHandler}
