import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import * as mustache from 'mustache'
import { LogTemplate } from '../../interfaces'
import { ServerConfig } from '../config'
import { LOG_LEVEL } from './log-base'

const { combine, timestamp, printf } = winston.format

const logFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} | ${level} | ${message}`
})

class Logger {
  protected _logger: winston.Logger

  constructor(config: ServerConfig) {
    this._logger = winston.createLogger({
      level: 'debug',
      format: combine(
        timestamp(),
        logFormat
      ),
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
    })
  }

  public writeLog(logTemplate: LogTemplate, logArgs: object = {}): void {
    const logMsg = `${logTemplate.reference} | ${mustache.render(logTemplate.template, logArgs)}`
    switch (logTemplate.level) {
      case LOG_LEVEL.INFO:
        this._logger.info(logMsg)
        break
      case LOG_LEVEL.WARN:
        this._logger.warn(logMsg)
        break
      case LOG_LEVEL.DEBUG:
        this._logger.debug(logMsg)
        break
      default:
        this._logger.error(logMsg)
        break
    }
  }
}

export {Logger}
