import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { ROOM_NAME_PREFIX } from '../constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationDcError } from '../app/exceptions'

class AbstractHandler {
  protected _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
  }

  public start(socket: Socket, errorHandler: Function): void {
    throw new Error('not implemented')
  }

  protected _getSocketGameRoom(socket: Socket) {
    const allRooms = Array.from(socket.rooms)
    const gameRooms = allRooms.filter((roomName) => {
      return roomName.includes(ROOM_NAME_PREFIX)
    })

    if (gameRooms.length !== 1) {
      this._logger.writeLog(LOG_BASE.ROOM003, { roomNames: gameRooms })
      throw new GameDataValidationDcError('User not in game room')
    }

    return gameRooms[0]
  }
}

export {
  AbstractHandler
}
