import { AbstractValidator } from './abstract'
import { AqGameSettings } from '../shared/interfaces'
import { GAME_MODE } from '../shared/constants'
import { GameDataValidationError } from '../app/exceptions'

class SettingsValidator extends AbstractValidator {
  public validateSettings(settings: AqGameSettings): void {
    this._validateNumber(settings.songCount, 1, 100, 'Invalid song count')
    this._validateNumber(settings.guessTime, 20, 100, 'Invalid guess time')
    this._validateGameMode(settings.gameMode, 'Invalid game mode')
    this._validateBoolean(settings.duplicate, 'Invalid duplicate setting')
    this._validateUsers(settings.users, 'Invalid users')
  }

  protected _validateGameMode(val: string, msg: string): void {
    if (!Object.values(GAME_MODE).includes(val)) {
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateUsers(users: string[], msg: string): void {
    if (!Array.isArray(users)) {
      throw new GameDataValidationError(msg)
    }
  }
}

export { SettingsValidator }
