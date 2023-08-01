import { LogTemplate } from '../../interfaces';

const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const LOG_REFERENCES = {
  SERVER_START: 'SERVER001',
  CLIENT_CONNECTED: 'SERVER002',
  CLIENT_DISCONNECTED: 'SERVER003',
  INTERNAL_SERVER_ERROR: 'SERVER004',
  UNAUTHORIZED_CLIENT: 'SERVER005',
  DATA_QUALITY_ERROR: 'SERVER006',
  FETCHED_USER_SONG_LIST: 'SERVER007'
};

const LOG_TEMPLATES: { [key: string]: LogTemplate } = {
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
  },
  [LOG_REFERENCES.UNAUTHORIZED_CLIENT]: {
    message: 'unauthorized client',
    level: LOG_LEVEL.WARN
  },
  [LOG_REFERENCES.DATA_QUALITY_ERROR]: {
    message: 'data quality issue',
    level: LOG_LEVEL.WARN
  },
  [LOG_REFERENCES.FETCHED_USER_SONG_LIST]: {
    message: 'fetched user song list',
    level: LOG_LEVEL.DEBUG
  }
};

export { LOG_TEMPLATES, LOG_LEVEL, LOG_REFERENCES };
