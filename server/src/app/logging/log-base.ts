const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
}

const LOG_REFERENCES = {
  SERVER001: 'SERVER001',
  SERVER002: 'SERVER002',
  SERVER003: 'SERVER003',
  SERVER004: 'SERVER004',
  SERVER005: 'SERVER005',
  SERVER006: 'SERVER006',
  SERVER007: 'SERVER007',
  SERVER008: 'SERVER008',
  SERVER009: 'SERVER009',
  SERVER010: 'SERVER010',
  SERVER011: 'SERVER011',
  SERVER012: 'SERVER012',
  SERVER013: 'SERVER013',
  SERVER014: 'SERVER014',
  SERVER015: 'SERVER015',
  SERVER016: 'SERVER016',
  SERVER017: 'SERVER017',
  SERVER018: 'SERVER018',
  SERVER019: 'SERVER019',
  SERVER020: 'SERVER020',
  SERVER021: 'SERVER021',
  SERVER022: 'SERVER022',
  SERVER023: 'SERVER023',
  SERVER024: 'SERVER024'
}

const LOG_BASE = {
  ADMIN_LOCK_DB: {
    reference: LOG_REFERENCES.SERVER024,
    level: LOG_LEVEL.INFO,
    message: 'admin lock db'
  },
  USER_DATA_BACKUP_FAILED: {
    reference: LOG_REFERENCES.SERVER023,
    level: LOG_LEVEL.WARN,
    message: 'user data backup failed'
  },
  USER_DATA_BACKUP: {
    reference: LOG_REFERENCES.SERVER022,
    level: LOG_LEVEL.INFO,
    message: 'user data backup'
  },
  ADMIN_KICK_PLAYER: {
    reference: LOG_REFERENCES.SERVER021,
    level: LOG_LEVEL.INFO,
    message: 'kicking player'
  },
  SERVER_RUNNING: {
    reference: LOG_REFERENCES.SERVER001,
    level: LOG_LEVEL.INFO,
    message: 'server running'
  },
  NEW_CONNECTION: {
    reference: LOG_REFERENCES.SERVER002,
    level: LOG_LEVEL.INFO,
    message: 'new connection'
  },
  CLIENT_DISCONNECTED: {
    reference: LOG_REFERENCES.SERVER003,
    level: LOG_LEVEL.INFO,
    message: 'client disconnected'
  },
  UNHANDLED_ERROR: {
    reference: LOG_REFERENCES.SERVER004,
    level: LOG_LEVEL.ERROR,
    message: 'unhandled error'
  },
  JOINED_ROOM: {
    reference: LOG_REFERENCES.SERVER005,
    level: LOG_LEVEL.INFO,
    message: 'joined room'
  },
  LEAVE_ROOM: {
    level: LOG_LEVEL.INFO,
    reference: LOG_REFERENCES.SERVER006,
    message: 'left room'
  },
  SONG_DATA_VALIDATION_FAILURE: {
    reference: LOG_REFERENCES.SERVER007,
    level: LOG_LEVEL.WARN,
    message: 'song data validation failure'
  },
  USER_DATA_VALIDATION_FAILURE: {
    reference: LOG_REFERENCES.SERVER008,
    level: LOG_LEVEL.WARN,
    message: 'user data validation failure'
  },
  ROOM_DATA_VALIDATION_FAILURE: {
    reference: LOG_REFERENCES.SERVER009,
    level: LOG_LEVEL.WARN,
    message: 'room data validation failure'
  },
  EDIT_GAME_SETTINGS: {
    reference: LOG_REFERENCES.SERVER010,
    level: LOG_LEVEL.INFO,
    message: 'edit game settings'
  },
  GAME_DATA_VALIDATION_FAILURE: {
    reference: LOG_REFERENCES.SERVER011,
    level: LOG_LEVEL.WARN,
    message: 'game data validation error'
  },
  UNAUTHORISED_CLIENT: {
    reference: LOG_REFERENCES.SERVER012,
    level: LOG_LEVEL.WARN,
    message: 'unauthorised connection'
  },
  UNAUTHORISED_ADMIN: {
    reference: LOG_REFERENCES.SERVER013,
    level: LOG_LEVEL.WARN,
    message: 'non admin user sending admin commands'
  },
  NEW_GAME: {
    reference: LOG_REFERENCES.SERVER014,
    level: LOG_LEVEL.INFO,
    message: 'new game'
  },
  NEW_GAME_ROUND: {
    reference: LOG_REFERENCES.SERVER015,
    level: LOG_LEVEL.INFO,
    message: 'new round'
  },
  ADMIN_ANIME_EDIT: {
    reference: LOG_REFERENCES.SERVER016,
    level: LOG_LEVEL.INFO,
    message: 'admin anime edit'
  },
  ADMIN_SONG_EDIT: {
    reference: LOG_REFERENCES.SERVER017,
    level: LOG_LEVEL.INFO,
    message: 'admin song edit'
  },
  ADMIN_RELOAD_DB: {
    reference: LOG_REFERENCES.SERVER018,
    level: LOG_LEVEL.INFO,
    message: 'admin reload db'
  },
  EMOJI_DATA_VALIDATION_FAILURE: {
    reference: LOG_REFERENCES.SERVER019,
    level: LOG_LEVEL.WARN,
    message: 'emoji data validation failure'
  },
  ADMIN_EMOJI_EDIT: {
    reference: LOG_REFERENCES.SERVER020,
    level: LOG_LEVEL.INFO,
    message: 'admin emoji edit'
  }
}

export {
  LOG_BASE,
  LOG_LEVEL
}
