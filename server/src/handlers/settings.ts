import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { GameSettings } from '../game/settings'
import { Logger } from '../app/logging/logger'
import { Server } from '../app/server'
import { Emitter } from '../app/emitter'
import { AqGameSettings } from '../shared/interfaces'
import { ChatManager } from '../game/chat'
import { LOG_BASE } from '../app/logging/log-base'

class GameSettingsHandler extends AbstractHandler {
  protected _io: Server
  protected _settings: GameSettings
  protected _chat: ChatManager

  constructor(logger: Logger, settings: GameSettings, io: Server, emitter: Emitter, chatManager: ChatManager) {
    super(logger, emitter)
    this._settings = settings
    this._io = io
    this._chat = chatManager
  }


  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.GET_GAME_SETTINGS, () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._emitter.updateGameSetting(this._settings.getGameSettings(roomId), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_GAME_SETTINGS, (settings: AqGameSettings, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.EDIT_GAME_SETTINGS, {
          sid: socket.id,
          settings: settings
        })
        const roomId = this._getSocketGameRoom(socket)
        this._settings.editSettings(roomId, settings)
        this._emitter.updateGameSetting(this._settings.getGameSettings(roomId))
        const chatMsg = this._chat.generateSysMsg('Settings updated')
        this._emitter.updateGameChat(chatMsg, roomId)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  GameSettingsHandler
}
