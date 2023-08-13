import { Socket } from '../types';
import { Emitter } from '../emitters/emitter';
import { ZodError } from 'zod';
import { Logger } from './logger';

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

class DataQualityError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function _handleSocketError(logger: Logger, socket: Socket, emitter: Emitter, e: any) {
  if (e instanceof UnauthorizedError) {
    logger.warn('unauthorized client', {
      id: socket.id,
      clientData: socket.data.clientData,
      err: e
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
    logger.warn('data quality error', {
      id: socket.id,
      clientData: socket.data.clientData,
      err: e
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

  if (e instanceof DataQualityError) {
    logger.warn('data quality error', {
      id: socket.id,
      clientData: socket.data.clientData,
      err: e
    });
    emitter.systemNotification(
      {
        color: 'error',
        message: e.message
      },
      socket.id
    );
    return;
  }

  logger.error('internal server error', { err: e });
}

function _handleCallback(callback: any): void {
  if (typeof callback === 'function') {
    callback(false);
  }
}

function newSocketErrorHandler(logger: Logger, socket: Socket, emitter: Emitter): Function {
  return function (this: any, func: Function) {
    return (...args: any[]) => {
      const callback = args[args.length - 1];
      try {
        const ret = func.apply(this, args);
        if (ret && typeof ret.catch === 'function') {
          // async handler
          ret.catch((e: any) => {
            _handleSocketError(logger, socket, emitter, e);
            _handleCallback(callback);
          });
        }
      } catch (e: any) {
        // sync handler
        _handleSocketError(logger, socket, emitter, e);
        _handleCallback(callback);
      }
    };
  };
}

export { newSocketErrorHandler, DatabaseLockedError, UnauthorizedError, DataQualityError };
