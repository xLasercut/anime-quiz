import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { GameController } from '../game/controller'
import { Emitter } from '../app/emitter'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { ChatManager } from '../game/chat'

class GameHandler extends AbstractHandler {
  protected _controller: GameController
  protected _emitter: Emitter
  protected _chat: ChatManager

  constructor(logger: Logger, controller: GameController, emitter: Emitter, chat: ChatManager) {
    super(logger)
    this._controller = controller
    this._emitter = emitter
    this._chat = chat
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._controller.validateNewRoomName(roomName)
        socket.join(`${ROOM_NAME_PREFIX}|${roomName}|${v4()}`)
        this._controller.syncRoomStates()
        this._emitter.updateRoomList(this._controller.getRoomList())
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.JOIN_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._controller.validateExistingRoomName(roomName)
        socket.join(`${ROOM_NAME_PREFIX}|${roomName}`)
        this._controller.syncRoomStates()
        this._emitter.updateRoomList(this._controller.getRoomList())
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GAME_CHAT, (message: string) => {
      try {
        const roomId = this._controller.getSocketGameRoom(socket)
        this._emitter.updateGameChat(this._chat.generateUserMsg(socket, message), roomId)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  GameHandler
}
