const NOTIFICATION_COLOR = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

const SONG_LIST_EDIT_MODE = {
  ADD: 'add',
  REMOVE: 'remove',
  NONE: 'none'
}

const ROOM_NAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')

export {
  NOTIFICATION_COLOR,
  SONG_LIST_EDIT_MODE,
  ROOM_NAME_FORMAT
}
