import { IGameSettings } from '../shared/interfaces';
import { Logger } from '../app/logging/logger';
import { LOG_BASE } from '../app/logging/log-base';
import { GameDataValidationError } from '../app/exceptions';
import { NORMAL } from '../shared/constants/game-modes';
import { GameSettings } from '../models/game';

class GameSettingsDb {
  protected _logger: Logger;
  protected _settings: { [key: string]: GameSettings };

  constructor(logger: Logger) {
    this._logger = logger;
    this._settings = {};
  }

  public getGameSettings(roomId: string): IGameSettings {
    this._validateRoomExists(roomId);
    return this._settings[roomId].dict();
  }

  public editSettings(roomId: string, _settings: IGameSettings): void {
    this._validateRoomExists(roomId);
    this._settings[roomId] = new GameSettings(_settings);
  }

  public addRoom(roomId: string): void {
    const settings: IGameSettings = {
      songCount: 20,
      guessTime: 30,
      gameMode: NORMAL,
      duplicate: false,
      users: []
    };
    this._settings[roomId] = new GameSettings(settings);
  }

  public deleteRoom(roomId: string): void {
    delete this._settings[roomId];
  }

  protected _validateRoomExists(roomId: string): void {
    if (!(roomId in this._settings)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, {
        roomName: roomId
      });
      throw new GameDataValidationError('Room does not exist');
    }
  }
}

export { GameSettingsDb };
