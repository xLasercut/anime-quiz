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
  SERVER005: {
    code: 'SERVER005',
    level: LOG_LEVEL.INFO,
    template: 'joined room - id="{{id}} roomId="{{roomId}}"'
  },
  DATA001: {
    code: 'DATA001',
    level: LOG_LEVEL.WARN,
    template: 'server data error - reason="{{reason}}"'
  },
  DATA002: {
    code: 'DATA002',
    level: LOG_LEVEL.WARN,
    template: 'game data error - reason="{{reason}}"'
  },
  AUTH002: {
    code: 'AUTH002',
    level: LOG_LEVEL.WARN,
    template: 'unauthorised connection - id="{{id}}"'
  },
  AUTH003: {
    code: 'AUTH003',
    level: LOG_LEVEL.WARN,
    template: 'admin command attempted by non admin connection - id="{{id}}"'
  },
  LIST001: {
    code: 'LIST001',
    level: LOG_LEVEL.INFO,
    template: 'amq list data request - id="{{id}}" data="{{data}}"'
  },
  LIST002: {
    code: 'LIST002',
    level: LOG_LEVEL.INFO,
    template: 'amq user song data operation - id="{{id}}" user="{{user}}" operation="{{operation}}" songId="{{songId}}"'
  },
  LIST003: {
    code: 'LIST003',
    level: LOG_LEVEL.INFO,
    template: 'amq list data operation - id="{{id}}" operation="{{operation}}" songId="{{songId}}" anime="{{anime}}" src="{{src}}" title="{{title}}" artist="{{artist}}" type="{{type}}"'
  },
  EMOJI001: {
    code: 'EMOJI001',
    level: LOG_LEVEL.INFO,
    template: 'emoji data request - id="{{id}}"'
  },
  EMOJI002: {
    code: 'EMOJI002',
    level: LOG_LEVEL.INFO,
    template: 'emoji data operation - id="{{id}}" operation="{{operation}}" command="{{command}}" src="{{src}}" type="{{type}}"'
  },
  CHAT001: {
    code: 'CHAT001',
    level: LOG_LEVEL.INFO,
    template: 'chat bot data request - id="{{id}}"'
  },
  CHAT002: {
    code: 'CHAT002',
    level: LOG_LEVEL.INFO,
    template: 'chat bot data operation - id="{{id}}" operation="{{operation}}" regex="{{regex}}" flag="{{flag}}" user="{{user}}" text="{{text}}" avatar="{{avatar}}" userId="{{userId}}"'
  },
  CHAT003: {
    code: 'CHAT003',
    level: LOG_LEVEL.INFO,
    template: 'player message - id="{{id}}" username="{{username}}" message="{{message}}"'
  },
  SETTING001: {
    code: 'SETTING001',
    level: LOG_LEVEL.INFO,
    template: 'amq setting request - id="{{id}}" username="{{username}}"'
  },
  SETTING002: {
    code: 'SETTING002',
    level: LOG_LEVEL.INFO,
    template: 'amq setting update - id="{{id}}" username="{{username}}" songCount="{{songCount}}" guessTime="{{guessTime}}" gameMode="{{gameMode}}" users="{{users}}" duplicate="{{duplicate}}" leastPlayed="{{leastPlayed}}"'
  },
  GAME001: {
    code: 'GAME001',
    level: LOG_LEVEL.INFO,
    template: 'amq new game - roomId="{{roomId}}" gameMode="{{gameMode}}" songCount="{{songCount}}"'
  },
  GAME002: {
    code: 'GAME002',
    level: LOG_LEVEL.INFO,
    template: 'amq new song - roomId="{{roomId}}" songId="{{songId}}" anime="{{anime}}" src="{{src}}" title="{{title}}" artist="{{artist}}" type="{{type}}"'
  },
  GAME003: {
    code: 'GAME003',
    level: LOG_LEVEL.INFO,
    template: 'amq song override - roomId="{{roomId}}" songId="{{songId}}" anime="{{anime}}" src="{{src}}" title="{{title}}" artist="{{artist}}" type="{{type}}"'
  },
  GAME004: {
    code: 'GAME004',
    level: LOG_LEVEL.INFO,
    template: 'amq room list request - id="{{id}}"'
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
