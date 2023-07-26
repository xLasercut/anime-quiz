import { LogTemplate } from '../../interfaces';

const LOG_LEVEL = Object.freeze({
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
});

const LOG_REFERENCES = Object.freeze({
  SERVER_START: 'SERVER001',
  CLIENT_CONNECTED: 'SERVER002',
  CLIENT_DISCONNECTED: 'SERVER003',
  INTERNAL_SERVER_ERROR: 'SERVER004'
});

const LOG_TEMPLATES = Object.freeze<{ [key: string]: LogTemplate }>({
  [LOG_REFERENCES.SERVER_START]: {
    message: 'server started',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.CLIENT_CONNECTED]: {
    message: 'client connected',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.CLIENT_DISCONNECTED]: {
    message: 'client disconnected',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.INTERNAL_SERVER_ERROR]: {
    message: 'internal server error',
    level: LOG_LEVEL.ERROR
  }
});

export { LOG_TEMPLATES, LOG_LEVEL, LOG_REFERENCES };
