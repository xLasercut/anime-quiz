import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import * as mustache from 'mustache'
import {LOG_DIR} from '../config'
import {ILog} from '../interfaces'

let {combine, timestamp, printf} = winston.format

let logFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} | ${level} | ${message}`
})

let winstonLogger = winston.createLogger({
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
      dirname: LOG_DIR,
      maxFiles: '5'
    }),
    new winston.transports.Console()
  ]
})


const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
}

const LOG_BASE = {
  SERVER001: {
    code: 'SERVER001',
    level: LOG_LEVEL.INFO,
    template: 'server running on port="{{port}}"'
  }
}


class Logger {
  public writeLog(log: ILog, variables: object = {}): void {
    let logMsg = `${log.code} | ${mustache.render(log.template, variables)}`
    switch (log.level) {
      case LOG_LEVEL.INFO:
        winstonLogger.info(logMsg)
        break
      case LOG_LEVEL.WARN:
        winstonLogger.warn(logMsg)
        break
      case LOG_LEVEL.DEBUG:
        winstonLogger.debug(logMsg)
        break
      default:
        winstonLogger.error(logMsg)
        break
    }
  }
}


export {Logger, LOG_BASE}
