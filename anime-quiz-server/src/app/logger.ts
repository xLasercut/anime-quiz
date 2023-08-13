import pino from 'pino';
import { ServerConfig } from '../interfaces';

class Logger {
  protected _logger: pino.Logger;

  constructor(config: ServerConfig) {
    this._logger = pino({
      nestedKey: 'data',
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => {
          return {
            level: label.toUpperCase()
          };
        }
      }
    });
  }

  public info(msg: string, obj: any, ...args: any[]) {
    this._logger.info(obj, msg, args);
  }

  public warn(msg: string, obj: any, ...args: any[]) {
    this._logger.warn(obj, msg, args);
  }

  public error(msg: string, obj: any, ...args: any[]) {
    this._logger.error(obj, msg, args);
  }

  public debug(msg: string, obj: any, ...args: any[]) {
    this._logger.debug(obj, msg, args);
  }
}

export { Logger };
