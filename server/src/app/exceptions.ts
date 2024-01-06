import { Socket } from '../types';
import { Emitter } from '../emitters/emitter';
import { ZodError } from 'zod';
import { Logger } from './logger';
import { GameChatSerialiser } from '../game-state/chat';

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

class SongListEmptyError extends Error {
  constructor() {
    super('song list empty');
  }
}

function _handleSocketError(logger: Logger, socket: Socket, emitter: Emitter, chatSerialiser: GameChatSerialiser, e: any) {
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

  if (e instanceof SongListEmptyError) {
    const chatMessage = chatSerialiser.generateSystemMsg('Empty song list');
    emitter.updateGameChat(chatMessage, socket.data.currentGameRoom);
    return;
  }

  if (e instanceof DatabaseLockedError) {
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

function _handleIoError(logger: Logger, e: any) {
  if (e instanceof ZodError) {
    logger.warn('data quality error', { err: e });
    return;
  }

  logger.error('internal server error', { err: e });
}

function newSocketErrorHandler(logger: Logger, socket: Socket, emitter: Emitter, chatSerialiser: GameChatSerialiser): Function {
  return function (this: any, func: Function) {
    return (...args: any[]) => {
      const callback = args[args.length - 1];
      try {
        const ret = func.apply(this, args);
        if (ret && typeof ret.catch === 'function') {
          // async handler
          ret.catch((e: any) => {
            _handleSocketError(logger, socket, emitter, chatSerialiser, e);
            _handleCallback(callback);
          });
        }
      } catch (e: any) {
        // sync handler
        _handleSocketError(logger, socket, emitter, chatSerialiser, e);
        _handleCallback(callback);
      }
    };
  };
}

function newIoErrorHandler(logger: Logger): Function {
  return function (this: any, func: Function) {
    return (...args: any[]) => {
      const callback = args[args.length - 1];
      try {
        const ret = func.apply(this, args);
        if (ret && typeof ret.catch === 'function') {
          // async handler
          ret.catch((e: any) => {
            _handleIoError(logger, e);
            _handleCallback(callback);
          });
        }
      } catch (e: any) {
        // sync handler
        _handleIoError(logger, e);
        _handleCallback(callback);
      }
    };
  };
}

export { newSocketErrorHandler, DatabaseLockedError, UnauthorizedError, DataQualityError, newIoErrorHandler, SongListEmptyError };
