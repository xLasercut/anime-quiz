import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { ROOM_NAME_PREFIX } from '../constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationDcError } from '../app/exceptions'
import { Emitter } from '../app/emitter'

class AbstractHandler {
  protected _logger: Logger
  protected _emitter: Emitter

  constructor(logger: Logger, emitter: Emitter) {
    this._logger = logger
    this._emitter = emitter
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
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomNames: gameRooms })
      throw new GameDataValidationDcError('User not in game room')
    }

    return gameRooms[0]
  }

  protected _validateIsAdmin(socket: Socket): void {
    if (!socket.data.admin) {
      this._logger.writeLog(LOG_BASE.UNAUTHORISED_ADMIN, { id: socket.id, username: socket.data.username })
      throw new GameDataValidationDcError('Unauthorised')
    }
  }
}

export {
  AbstractHandler
}
