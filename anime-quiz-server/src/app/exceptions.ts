import { Socket } from 'socket.io';
import { Logger } from './logging/logger';
import { LOG_REFERENCES } from './logging/constants';

class DatabaseLockedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function _handleSocketError(logger: Logger, socket: Socket, e: any) {
  logger.writeLog(LOG_REFERENCES.INTERNAL_SERVER_ERROR, {
    stack: e.stack
  });
}

function socketErrorHandler(logger: Logger, socket: Socket): Function {
  return function (func: Function) {
    return (...args: any) => {
      try {
        // @ts-ignore
        const ret = func.apply(this, args);
        if (ret && typeof ret.catch === 'function') {
          // async handler
          ret.catch((e: any) => {
            _handleSocketError(logger, socket, e);
          });
        }
      } catch (e: any) {
        // sync handler
        _handleSocketError(logger, socket, e);
      }
    };
  };
}

export { socketErrorHandler, DatabaseLockedError };
