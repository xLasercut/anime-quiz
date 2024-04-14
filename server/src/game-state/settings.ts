import {
  GAME_MODES,
  SONG_TYPES,
  TGameRoomSettings,
  TGameRoomSettingsGameMode,
  TGameRoomSettingsGuessTime,
  TGameRoomSettingsLoadTime,
  TGameRoomSettingSongCount,
  TSongType
} from 'anime-quiz-shared-resources';

class GameSettings {
  protected _songCount: TGameRoomSettingSongCount = 20;
  protected _guessTime: TGameRoomSettingsGuessTime = 30;
  protected _loadTime: TGameRoomSettingsLoadTime = 10;
  protected _duplicate: boolean = false;
  protected _leastPlayed: boolean = true;
  protected _gameMode: TGameRoomSettingsGameMode = GAME_MODES.BALANCED_PLUS;
  protected _songType: TSongType[] = [SONG_TYPES.OP, SONG_TYPES.ED, SONG_TYPES.INSERT];

  public get dict(): TGameRoomSettings {
    return {
      songCount: this._songCount,
      guessTime: this._guessTime,
      loadTime: this._loadTime,
      duplicate: this._duplicate,
      gameMode: this._gameMode,
      songType: this._songType,
      leastPlayed: this._leastPlayed
    };
  }

  public update(settings: TGameRoomSettings) {
    this._songCount = settings.songCount;
    this._guessTime = settings.guessTime;
    this._duplicate = settings.duplicate;
    this._gameMode = settings.gameMode;
    this._songType = settings.songType;
    this._loadTime = settings.loadTime;
    this._leastPlayed = settings.leastPlayed;
  }
}

export { GameSettings };
