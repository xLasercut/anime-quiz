import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { GameSettings } from '../game/settings'
import { Logger } from '../app/logging/logger'
import { AqGameSettings } from '../shared/interfaces'
import { LOG_BASE } from '../app/logging/log-base'
import { GameEmitter } from '../emitters/game'

class GameSettingsHandler extends AbstractHandler {
  protected _settings: GameSettings
  protected _gameEmitter: GameEmitter

  constructor(logger: Logger, settings: GameSettings, gameEmitter: GameEmitter) {
    super(logger)
    this._settings = settings
    this._gameEmitter = gameEmitter
  }


  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.GET_GAME_SETTINGS, () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._gameEmitter.updateGameSetting(roomId, socket.id)
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
        this._gameEmitter.updateGameSetting(roomId, roomId)
        this._gameEmitter.updateGameChatSys('Settings updated', roomId)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })
  }
}

export {
  GameSettingsHandler
}
