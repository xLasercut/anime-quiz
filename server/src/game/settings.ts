import { AqGameSettings } from '../shared/interfaces'
import { GAME_MODE } from '../shared/constants'
import { Logger } from '../app/logging/logger'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { SettingsValidator } from '../validator/settings'

class GameSettings {
  protected _logger: Logger
  protected _settings: { [key: string]: AqGameSettings }
  protected _validator: SettingsValidator

  constructor(logger: Logger) {
    this._logger = logger
    this._settings = {}
    this._validator = new SettingsValidator()
  }

  public getGameSettings(roomId: string): AqGameSettings {
    this._validateRoomExists(roomId)
    return this._settings[roomId]
  }

  public editSettings(roomId: string, settings: AqGameSettings): void {
    this._validateRoomExists(roomId)
    this._validator.validateSettings(settings)
    this._settings[roomId].songCount = settings.songCount
    this._settings[roomId].guessTime = settings.guessTime
    this._settings[roomId].gameMode = settings.gameMode
    this._settings[roomId].duplicate = settings.duplicate
    this._settings[roomId].users = settings.users
  }

  public addRoom(roomId: string): void {
    this._settings[roomId] = {
      songCount: 20,
      guessTime: 30,
      gameMode: GAME_MODE.NORMAL,
      duplicate: false,
      users: []
    }
  }

  public deleteRoom(roomId: string): void {
    delete this._settings[roomId]
  }

  protected _validateRoomExists(roomId: string): void {
    if (!(roomId in this._settings)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomName: roomId })
      throw new GameDataValidationError('Room does not exist')
    }
  }
}

export { GameSettings }
