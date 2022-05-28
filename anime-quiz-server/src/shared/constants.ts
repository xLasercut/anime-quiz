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
const USERNAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')

const GAME_MODE = {
  NORMAL: 'normal',
  BALANCED: 'balanced'
}

const AVATARS = {
  ZERO_TWO: 'Zero Two',
  INITIAL_D: 'AE86',
  MISAKA: 'Misaka',
  EVA_UNIT_1: 'Eva Unit One',
  HOMURA: 'Homura',
  ALPHONSE: 'Alphonse',
  HORO: 'Horo',
  MADOKA: 'Madoka',
  LELOUCH: 'Lelouch',
  MIYU: 'Miyu',
  RAWR: 'Rawr',
  PIKACHU: 'Pikachu',
  EREN: 'Eren',
  JUDAI: 'Judai',
  YUGI: 'Yugi'
}

const LOCAL_STORAGE_CONSTANTS = {
  DARK_THEME: 'DARK_THEME',
  GAME_SERVER: 'GAME_SERVER',
  AQ_USERNAME: 'AQ_USERNAME',
  AQ_AVATAR: 'AQ_AVATAR',
  USER_DB_PATH: 'USER_DB_PATH',
  SONG_DB_PATH: 'SONG_DB_PATH'
}

export {
  NOTIFICATION_COLOR,
  SONG_LIST_EDIT_MODE,
  ROOM_NAME_FORMAT,
  GAME_MODE,
  AVATARS,
  USERNAME_FORMAT,
  LOCAL_STORAGE_CONSTANTS
}
