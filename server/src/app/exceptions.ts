import { Logger } from './logging/logger'
import { Socket } from '../types'
import { LOG_BASE } from './logging/log-base'
import { Emitter } from './emitter'
import { NOTIFICATION_COLOR } from '../shared/constants'

class GameDataValidationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class GameDataValidationDcError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class DatabaseLockedError extends Error {
  constructor(message: string) {
    super(message)
  }
}

function newSocketErrorHandler(socket: Socket, logger: Logger, emitter: Emitter) {
  function errorHandler(e: Error) {
    if (e instanceof GameDataValidationError) {
      logger.writeLog(LOG_BASE.GAME_DATA_VALIDATION_FAILURE, { id: socket.id, username: socket.data.username, error: e.message })
      emitter.systemNotification(NOTIFICATION_COLOR.ERROR, e.message, socket.id)
    } else if (e instanceof GameDataValidationDcError) {
      logger.writeLog(LOG_BASE.GAME_DATA_VALIDATION_FAILURE, { id: socket.id, username: socket.data.username, error: e.message })
      emitter.systemNotification(NOTIFICATION_COLOR.ERROR, e.message, socket.id)
      socket.disconnect()
    } else if (e instanceof DatabaseLockedError) {
      emitter.systemNotification(NOTIFICATION_COLOR.ERROR, e.message, socket.id)
    } else {
      logger.writeLog(LOG_BASE.UNHANDLED_ERROR, { stack: e.stack })
    }
  }

  return errorHandler
}


function newIoErrorHandler(logger: Logger) {
  function errorHandler(e: Error) {
    logger.writeLog(LOG_BASE.UNHANDLED_ERROR, { stack: e.stack })
  }

  return errorHandler
}

export {
  newSocketErrorHandler,
  newIoErrorHandler,
  GameDataValidationError,
  GameDataValidationDcError,
  DatabaseLockedError
}
