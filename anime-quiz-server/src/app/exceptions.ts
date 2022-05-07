import {Logger} from './logging/logger'
import {Socket} from '../types'
import {LOG_BASE} from './logging/log-base'

function newErrorHandler(socket: Socket, logger: Logger) {
  function errorHandler(f: Function): any {
    return function() {
      try {
        return f.apply(null, arguments)
      } catch (e) {
        logger.writeLog(LOG_BASE.SERVER004, {stack: e.stack})
      }
    }
  }

  return errorHandler
}


export {newErrorHandler}
