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
  },
  SERVER002: {
    code: 'SERVER002',
    level: LOG_LEVEL.INFO,
    template: 'new connection - id="{{id}}"'
  },
  SERVER003: {
    code: 'SERVER003',
    level: LOG_LEVEL.INFO,
    template: 'client disconnected - id="{{id}}"'
  },
  SERVER004: {
    code: 'SERVER004',
    level: LOG_LEVEL.ERROR,
    template: 'unhandled error - stack="{{stack}}"'
  },
  DATA001: {
    code: 'DATA001',
    level: LOG_LEVEL.WARN,
    template: 'server data error - reason="{{reason}}"'
  },
  AUTH002: {
    code: 'AUTH002',
    level: LOG_LEVEL.WARN,
    template: 'unauthorised connection - id="{{id}}"'
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
