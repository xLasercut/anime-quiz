import {
  GameRoomSettingsGameModeType,
  GameRoomSettingsGuessTimeType,
  GameRoomSettingSongCountType,
  GameRoomSettingsType
} from '../shared/models/types';
import { GAME_MODES } from '../shared/game-modes';

class GameSettings {
  protected _songCount: GameRoomSettingSongCountType = 20;
  protected _guessTime: GameRoomSettingsGuessTimeType = 40;
  protected _duplicate: boolean = false;
  protected _gameMode: GameRoomSettingsGameModeType = GAME_MODES.NORMAL;

  public get dict(): GameRoomSettingsType {
    return {
      songCount: this._songCount,
      guessTime: this._guessTime,
      duplicate: this._duplicate,
      gameMode: this._gameMode
    };
  }

  public update(settings: GameRoomSettingsType) {
    this._songCount = settings.songCount;
    this._guessTime = settings.guessTime;
    this._duplicate = settings.duplicate;
    this._gameMode = settings.gameMode;
  }
}

export { GameSettings };
