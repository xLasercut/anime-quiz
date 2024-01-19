import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { SERVER_CONFIG } from './config';

const { combine, timestamp, json, errors } = format;

const LOG_FORMAT = combine(
  timestamp(),
  format((info) => {
    const { timestamp, level, message, ...rest } = info;
    return {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...rest
    };
  })(),
  errors({ stack: true }),
  json({ deterministic: false })
);

const LOG_TRANSPORTS = [
  new DailyRotateFile({
    frequency: '24h',
    filename: 'anime-quiz-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: SERVER_CONFIG.logDir,
    maxFiles: '5'
  }),
  new transports.Console()
];

export { LOG_FORMAT, LOG_TRANSPORTS };
