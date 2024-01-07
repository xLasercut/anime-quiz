import {
  GameRoomSettingsGameModeType,
  GameRoomSettingsGuessTimeType,
  GameRoomSettingsLoadTimeType,
  GameRoomSettingSongCountType,
  GameRoomSettingsType,
  SongTypeType
} from '../shared/models/types';
import { GAME_MODES } from '../shared/game-modes';
import { SONG_TYPES } from '../shared/song-types';

class GameSettings {
  protected _songCount: GameRoomSettingSongCountType = 20;
  protected _guessTime: GameRoomSettingsGuessTimeType = 30;
  protected _loadTime: GameRoomSettingsLoadTimeType = 10;
  protected _duplicate: boolean = false;
  protected _gameMode: GameRoomSettingsGameModeType = GAME_MODES.NORMAL;
  protected _songType: SongTypeType[] = [SONG_TYPES.OP, SONG_TYPES.ED, SONG_TYPES.INSERT];

  public get dict(): GameRoomSettingsType {
    return {
      songCount: this._songCount,
      guessTime: this._guessTime,
      loadTime: this._loadTime,
      duplicate: this._duplicate,
      gameMode: this._gameMode,
      songType: this._songType
    };
  }

  public update(settings: GameRoomSettingsType) {
    this._songCount = settings.songCount;
    this._guessTime = settings.guessTime;
    this._duplicate = settings.duplicate;
    this._gameMode = settings.gameMode;
    this._songType = settings.songType;
    this._loadTime = settings.loadTime;
  }
}

export { GameSettings };
