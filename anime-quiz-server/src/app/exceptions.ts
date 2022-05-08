import {Logger} from './logging/logger'
import {Socket} from '../types'
import {LOG_BASE} from './logging/log-base'

function newErrorHandler(socket: Socket, logger: Logger) {
  function errorHandler(e: Error) {
    logger.writeLog(LOG_BASE.SERVER004, {stack: e.stack})
  }

  return errorHandler
}


export {newErrorHandler}
