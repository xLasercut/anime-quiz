import { AqGameSettingsSerialised } from '../shared/interfaces'
import { GAME_MODE } from '../shared/constants'
import { Logger } from '../app/logging/logger'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'

class GameSettings {
  protected _logger: Logger
  protected _settings: { [key: string]: AqGameSettingsSerialised }

  constructor(logger: Logger) {
    this._logger = logger
    this._settings = {}
  }

  public getGameSettings(roomId: string): AqGameSettingsSerialised {
    this._validateRoomExists(roomId)
    return this._settings[roomId]
  }

  public editSettings(roomId: string, settings: AqGameSettingsSerialised): void {
    this._validateRoomExists(roomId)
    this._validateSettings(settings)
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

  protected _validateSettings(settings: AqGameSettingsSerialised): void {
    this._validateNumber(settings.songCount, 1, 100, 'Invalid song count')
    this._validateNumber(settings.guessTime, 20, 100, 'Invalid guess time')
    this._validateGameMode(settings.gameMode, 'Invalid game mode')
    this._validateBoolean(settings.duplicate, 'Invalid duplicate setting')
    this._validateUsers(settings.users, 'Invalid users')
  }

  protected _validateNumber(val: number, min: number, max: number, msg: string): void {
    if (!val || typeof val !== 'number') {
      this._logger.writeLog(LOG_BASE.SETTINGS001, { value: val })
      throw new GameDataValidationError(msg)
    }

    if (val < min || val > max) {
      this._logger.writeLog(LOG_BASE.SETTINGS001, { value: val })
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateGameMode(val: string, msg: string): void {
    if (!Object.values(GAME_MODE).includes(val)) {
      this._logger.writeLog(LOG_BASE.SETTINGS001, { value: val })
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateBoolean(val: boolean, msg: string): void {
    if (![ true, false ].includes(val)) {
      this._logger.writeLog(LOG_BASE.SETTINGS001, { value: val })
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateRoomExists(roomId: string): void {
    if (!(roomId in this._settings)) {
      this._logger.writeLog(LOG_BASE.ROOM001, { roomName: roomId })
      throw new GameDataValidationError('Room does not exist')
    }
  }

  protected _validateUsers(users: string[], msg: string): void {
    if (!Array.isArray(users)) {
      this._logger.writeLog(LOG_BASE.ROOM001, { value: users })
      throw new GameDataValidationError(msg)
    }
  }
}

export {
  GameSettings
}
