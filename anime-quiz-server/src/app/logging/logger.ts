import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LogTemplate, ServerConfig } from '../../interfaces';
import { LOG_LEVEL, LOG_TEMPLATES } from './constants';

const { combine, timestamp, json } = winston.format;

const logFormat = combine(
  timestamp(),
  winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  json()
);

class Logger {
  protected _logger: winston.Logger;

  constructor(config: ServerConfig) {
    this._logger = winston.createLogger({
      level: config.logLevel,
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
  }

  public writeLog(logReference: string, logArgs: object = {}): void {
    const template = this._getTemplate(logReference);
    const logMsg = {
      ['logReference']: logReference,
      ['message']: template.message,
      ['data']: logArgs
    };
    switch (template.level) {
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

  protected _getTemplate(logReference: string): LogTemplate {
    if (logReference in LOG_TEMPLATES) {
      return LOG_TEMPLATES[logReference];
    }
    return {
      message: 'log reference not found',
      level: LOG_LEVEL.ERROR
    };
  }
}

export { Logger };
