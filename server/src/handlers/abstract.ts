import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { ROOM_NAME_PREFIX } from '../constants';
import { LOG_BASE } from '../app/logging/log-base';
import { GameDataValidationDcError } from '../app/exceptions';

class AbstractHandler {
  protected _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  public start(socket: ISocket, errorHandler: Function): void {
    throw new Error('not implemented');
  }

  protected _getSocketGameRoom(socket: ISocket) {
    const allRooms = Array.from(socket.rooms);
    const gameRooms = allRooms.filter((roomName) => {
      return roomName.includes(ROOM_NAME_PREFIX);
    });

    if (gameRooms.length !== 1) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomNames: gameRooms });
      throw new GameDataValidationDcError('User not in game room');
    }

    return gameRooms[0];
  }

  protected _validateIsAdmin(socket: ISocket): void {
    if (!socket.data.admin) {
      this._logger.writeLog(LOG_BASE.UNAUTHORISED_ADMIN, {
        id: socket.id,
        username: socket.data.username
      });
      throw new GameDataValidationDcError('Unauthorised');
    }
  }
}

export { AbstractHandler };
