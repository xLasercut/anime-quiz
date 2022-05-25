import { AqGameSettingsSerialised } from '../shared/interfaces'
import { GAME_MODE } from '../shared/constants'

class GameSettings {
  protected _songCount: number
  protected _guessTime: number
  protected _gameMode: string
  protected _duplicate: boolean
  protected _users: string[]

  constructor() {
    this._songCount = 20
    this._guessTime = 30
    this._gameMode = GAME_MODE.NORMAL
    this._duplicate = false
    this._users = []
  }

  public serialise(): AqGameSettingsSerialised {
    return {
      songCount: this._songCount,
      guessTime: this._guessTime,
      gameMode: this._gameMode,
      duplicate: this._duplicate,
      users: this._users
    }
  }
}

export {
  GameSettings
}
