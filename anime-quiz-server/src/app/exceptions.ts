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

function newErrorHandler(socket: Socket, logger: Logger, emitter: Emitter) {
  function errorHandler(e: Error) {
    if (e instanceof GameDataValidationError) {
      logger.writeLog(LOG_BASE.DATA001, { id: socket.id, username: socket.data.username })
      emitter.systemNotification(NOTIFICATION_COLOR.ERROR, e.message, socket.id)
    } else {
      logger.writeLog(LOG_BASE.SERVER004, { stack: e.stack })
    }
  }

  return errorHandler
}


export {
  newErrorHandler,
  GameDataValidationError
}
