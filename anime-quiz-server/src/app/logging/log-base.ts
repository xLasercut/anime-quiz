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
  }
}

export {
  LOG_BASE,
  LOG_LEVEL
}
