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
    template: 'server running on port="{{{port}}}"'
  },
  SERVER002: {
    reference: 'SERVER002',
    level: LOG_LEVEL.INFO,
    template: 'new connection - id="{{{id}}}"'
  },
  SERVER003: {
    reference: 'SERVER003',
    level: LOG_LEVEL.INFO,
    template: 'client disconnected - id="{{{id}}}"'
  },
  SERVER004: {
    reference: 'SERVER004',
    level: LOG_LEVEL.ERROR,
    template: 'unhandled error - stack="{{{stack}}}"'
  },
  SERVER005: {
    reference: 'SERVER005',
    level: LOG_LEVEL.INFO,
    template: 'joined room - id="{{{id}}}" username="{{{username}}}" roomId="{{{roomId}}}"'
  },
  SONG001: {
    reference: 'SONG001',
    level: LOG_LEVEL.WARN,
    template: 'song edit user does not exist - userId="{{{userId}}}"'
  },
  SONG002: {
    reference: 'SONG002',
    level: LOG_LEVEL.WARN,
    template: 'song edit song does not exist - songIds="{{{songIds}}}"'
  },
  SONG003: {
    reference: 'SONG003',
    level: LOG_LEVEL.WARN,
    template: 'song edit song already exists in user list - songIds="{{{songIds}}}"'
  },
  SONG004: {
    reference: 'SONG004',
    level: LOG_LEVEL.WARN,
    template: 'song edit song not exists in user list - songIds="{{{songIds}}}"'
  },
  DATA001: {
    reference: 'DATA001',
    level: LOG_LEVEL.WARN,
    template: 'game data validation error - id="{{{id}}}" username="{{{username}}}"'
  },
  AUTH002: {
    reference: 'AUTH002',
    level: LOG_LEVEL.WARN,
    template: 'unauthorised connection - id="{{{id}}}"'
  }
}

export {
  LOG_BASE,
  LOG_LEVEL
}
