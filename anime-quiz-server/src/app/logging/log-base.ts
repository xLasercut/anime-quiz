const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
}

const LOG_BASE = {
  SERVER001: {
    reference: 'SERVER001',
    level: LOG_LEVEL.INFO,
    message: 'server running'
  },
  SERVER002: {
    reference: 'SERVER002',
    level: LOG_LEVEL.INFO,
    message: 'new connection'
  },
  SERVER003: {
    reference: 'SERVER003',
    level: LOG_LEVEL.INFO,
    message: 'client disconnected'
  },
  SERVER004: {
    reference: 'SERVER004',
    level: LOG_LEVEL.ERROR,
    message: 'unhandled error'
  },
  SERVER005: {
    reference: 'SERVER005',
    level: LOG_LEVEL.INFO,
    message: 'joined room'
  },
  SERVER006: {
    reference: 'SERVER006',
    level: LOG_LEVEL.INFO,
    message: 'left room'
  },
  SONG001: {
    reference: 'SONG001',
    level: LOG_LEVEL.WARN,
    message: 'song edit user does not exist'
  },
  SONG002: {
    reference: 'SONG002',
    level: LOG_LEVEL.WARN,
    message: 'song edit song does not exist'
  },
  SONG003: {
    reference: 'SONG003',
    level: LOG_LEVEL.WARN,
    message: 'song edit song already exists in user list'
  },
  SONG004: {
    reference: 'SONG004',
    level: LOG_LEVEL.WARN,
    message: 'song edit song not exists in user list'
  },
  ADMIN001: {
    reference: 'ADMIN001',
    level: LOG_LEVEL.WARN,
    message: 'anime edit anime does not exist'
  },
  ADMIN002: {
    reference: 'ADMIN002',
    level: LOG_LEVEL.INFO,
    message: 'admin add anime'
  },
  ADMIN003: {
    reference: 'ADMIN003',
    level: LOG_LEVEL.INFO,
    message: 'admin edit anime'
  },
  ADMIN004: {
    reference: 'ADMIN004',
    level: LOG_LEVEL.INFO,
    message: 'admin delete anime'
  },
  ADMIN005: {
    reference: 'ADMIN005',
    level: LOG_LEVEL.INFO,
    message: 'admin add song'
  },
  ADMIN006: {
    reference: 'ADMIN006',
    level: LOG_LEVEL.INFO,
    message: 'admin edit song'
  },
  ADMIN007: {
    reference: 'ADMIN007',
    level: LOG_LEVEL.INFO,
    message: 'admin delete song'
  },
  ROOM001: {
    reference: 'ROOM001',
    level: LOG_LEVEL.WARN,
    message: 'room name does not exist'
  },
  ROOM002: {
    reference: 'ROOM002',
    level: LOG_LEVEL.WARN,
    message: 'invalid room name'
  },
  ROOM003: {
    reference: 'ROOM003',
    level: LOG_LEVEL.WARN,
    message: 'user not in game room/in multiple rooms'
  },
  SETTINGS001: {
    reference: 'SETTINGS001',
    level: LOG_LEVEL.WARN,
    message: 'invalid settings'
  },
  DATA001: {
    reference: 'DATA001',
    level: LOG_LEVEL.WARN,
    message: 'game data validation error'
  },
  AUTH002: {
    reference: 'AUTH002',
    level: LOG_LEVEL.WARN,
    message: 'unauthorised connection'
  },
  AUTH003: {
    reference: 'AUTH003',
    level: LOG_LEVEL.WARN,
    message: 'non admin user sending admin commands'
  },
  GAME001: {
    reference: 'GAME001',
    level: LOG_LEVEL.INFO,
    message: 'new game'
  }
}

export {
  LOG_BASE,
  LOG_LEVEL
}
