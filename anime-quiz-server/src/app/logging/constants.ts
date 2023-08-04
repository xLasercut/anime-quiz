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
  FETCHED_USER_SONG_LIST: 'SERVER007',
  FETCHED_USER_LIST: 'SERVER008',
  ADMIN_ADD_USER: 'SERVER009',
  ADMIN_DELETE_USER: 'SERVER010',
  ADMIN_EDIT_USER: 'SERVER011',
  UPDATE_USER_SETTINGS: 'SERVER012',
  ADMIN_ADD_ANIME: 'SERVER013',
  ADMIN_EDIT_ANIME: 'SERVER014',
  ADMIN_DELETE_ANIME: 'SERVER015',
  ADMIN_ADD_SONG: 'SERVER016',
  ADMIN_EDIT_SONG: 'SERVER017',
  ADMIN_DELETE_SONG: 'SERVER018'
};

const LOG_TEMPLATES: { [key: string]: LogTemplate } = {
  [LOG_REFERENCES.ADMIN_ADD_SONG]: {
    message: 'admin add song',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_EDIT_SONG]: {
    message: 'admin edit song',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_DELETE_SONG]: {
    message: 'admin delete song',
    level: LOG_LEVEL.INFO
  },
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
  },
  [LOG_REFERENCES.FETCHED_USER_LIST]: {
    message: 'fetched user list',
    level: LOG_LEVEL.DEBUG
  },
  [LOG_REFERENCES.ADMIN_ADD_USER]: {
    message: 'admin add user',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_EDIT_USER]: {
    message: 'admin edit user',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_DELETE_USER]: {
    message: 'admin delete user',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.UPDATE_USER_SETTINGS]: {
    message: 'update user settings',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_ADD_ANIME]: {
    message: 'admin add anime',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_EDIT_ANIME]: {
    message: 'admin edit anime',
    level: LOG_LEVEL.INFO
  },
  [LOG_REFERENCES.ADMIN_DELETE_ANIME]: {
    message: 'admin delete anime',
    level: LOG_LEVEL.INFO
  }
};

export { LOG_TEMPLATES, LOG_LEVEL, LOG_REFERENCES };
