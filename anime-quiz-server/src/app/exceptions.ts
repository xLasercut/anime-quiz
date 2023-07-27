import { Logger } from './logging/logger';
import { LOG_REFERENCES } from './logging/constants';
import { Socket } from '../types';
import { Emitter } from '../emitters/emitter';
import { ZodError } from 'zod';

class DatabaseLockedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

function _handleSocketError(logger: Logger, socket: Socket, emitter: Emitter, e: any) {
  if (e instanceof UnauthorizedError) {
    logger.writeLog(LOG_REFERENCES.UNAUTHORIZED_CLIENT, {
      id: socket.id,
      clientData: socket.data.clientData
    });
    emitter.systemNotification(
      {
        color: 'error',
        message: e.message
      },
      socket.id
    );
    socket.disconnect(true);
    return;
  }

  if (e instanceof ZodError) {
    logger.writeLog(LOG_REFERENCES.DATA_QUALITY_ERROR, {
      id: socket.id,
      clientData: socket.data.clientData,
      stack: e.stack
    });
    const firstIssue = e.issues[0];
    const fields = firstIssue.path.join(', ');
    const msg = `Could not complete operation due to data quality issues. fields: ${fields} code: ${firstIssue.code}`;
    emitter.systemNotification(
      {
        color: 'error',
        message: msg
      },
      socket.id
    );
    return;
  }

  logger.writeLog(LOG_REFERENCES.INTERNAL_SERVER_ERROR, {
    stack: e.stack
  });
}

function newSocketErrorHandler(logger: Logger, socket: Socket, emitter: Emitter): Function {
  return function (func: Function) {
    return (...args: any) => {
      try {
        // @ts-ignore
        const ret = func.apply(this, args);
        if (ret && typeof ret.catch === 'function') {
          // async handler
          ret.catch((e: any) => {
            _handleSocketError(logger, socket, emitter, e);
          });
        }
      } catch (e: any) {
        // sync handler
        _handleSocketError(logger, socket, emitter, e);
      }
    };
  };
}

export { newSocketErrorHandler, DatabaseLockedError, UnauthorizedError };
