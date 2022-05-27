import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { GameSettings } from '../game/settings'
import { Logger } from '../app/logging/logger'
import { Server } from '../app/server'
import { Emitter } from '../app/emitter'
import { AqGameSettings } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'

class GameSettingsHandler extends AbstractHandler {
  protected _io: Server
  protected _settings: GameSettings
  protected _emitter: Emitter

  constructor(logger: Logger, settings: GameSettings, io: Server, emitter: Emitter) {
    super(logger)
    this._settings = settings
    this._io = io
    this._emitter = emitter
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
        const roomId = this._getSocketGameRoom(socket)
        this._settings.editSettings(roomId, settings)
        this._emitter.updateGameSetting(this._settings.getGameSettings(roomId))
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, 'Settings updated', socket.id)
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
