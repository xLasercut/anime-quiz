import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { ChatManager } from '../game/chat'
import { Server } from '../app/server'
import { ROOM_NAME_FORMAT } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { GameSettings } from '../game/settings'

class GameHandler extends AbstractHandler {
  protected _io: Server
  protected _emitter: Emitter
  protected _chat: ChatManager
  protected _settings: GameSettings

  constructor(logger: Logger, io: Server, emitter: Emitter, settings: GameSettings) {
    super(logger)
    this._io = io
    this._emitter = emitter
    this._chat = new ChatManager(logger)
    this._settings = settings
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateNewRoomName(roomName)
        const roomId = `${ROOM_NAME_PREFIX}|${roomName}|${v4()}`
        socket.join(roomId)
        this._emitter.updateRoomList(this._io.getGameRoomList())
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.JOIN_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateExistingRoomName(roomName)
        socket.join(roomName)
        this._emitter.updateRoomList(this._io.getGameRoomList())
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GAME_CHAT, (message: string) => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._emitter.updateGameChat(this._chat.generateUserMsg(socket, message), roomId)
      } catch (e) {
        errorHandler(e)
      }
    })
  }

  protected _validateNewRoomName(roomName: string): void {
    if (!ROOM_NAME_FORMAT.test(roomName)) {
      this._logger.writeLog(LOG_BASE.ROOM002, { roomName: roomName })
      throw new GameDataValidationError('Invalid room name')
    }
  }

  protected _validateExistingRoomName(roomId: string): void {
    const roomList = this._io.getGameRoomList()
    if (!roomList.includes(roomId)) {
      this._logger.writeLog(LOG_BASE.ROOM001, { roomName: roomId })
      throw new GameDataValidationError('Room does not exist')
    }
  }
}

export {
  GameHandler
}
