import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogTemplate } from '../../interfaces';
import { ServerConfig } from '../config';
import { LOG_LEVEL } from './log-base';

const { combine, timestamp, json } = winston.format;

const logFormat = combine(timestamp(), winston.format(transformLogInfo)(), json());

function transformLogInfo(info) {
  info.level = info.level.toUpperCase();
  return info;
}

class Logger {
  protected _logger: winston.Logger;
  protected _reservedFields: string[];

  constructor(config: ServerConfig) {
    this._logger = winston.createLogger({
      level: 'debug',
      format: logFormat,
      transports: [
        new DailyRotateFile({
          frequency: '24h',
          filename: 'anime-quiz-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          dirname: config.logDir,
          maxFiles: '5'
        }),
        new winston.transports.Console()
      ]
    });
    this._reservedFields = ['timestamp', 'log_reference', 'level', 'message'];
  }

  public writeLog(logTemplate: LogTemplate, logArgs: object = {}): void {
    const cleanedLogArgs = this._removeReservedFields(logArgs);
    const logMsg = {
      ['log_reference']: logTemplate.reference,
      ['message']: logTemplate.message,
      ...cleanedLogArgs
    };
    switch (logTemplate.level) {
      case LOG_LEVEL.INFO:
        this._logger.info(logMsg);
        break;
      case LOG_LEVEL.WARN:
        this._logger.warn(logMsg);
        break;
      case LOG_LEVEL.DEBUG:
        this._logger.debug(logMsg);
        break;
      default:
        this._logger.error(logMsg);
        break;
    }
  }

  protected _removeReservedFields(logArgs: object = {}): object {
    const cleanedArgs = Object.assign({}, logArgs);
    for (const field in cleanedArgs) {
      if (this._reservedFields.includes(field)) {
        delete cleanedArgs[field];
      }
    }
    return cleanedArgs;
  }
}

export { Logger };
