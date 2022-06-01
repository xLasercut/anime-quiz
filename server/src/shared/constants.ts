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

const VALID_SONG_TYPES = [ 'OP', 'ED', 'INSERT' ]
const VALID_EMOJI_TYPES = [ 'img', 'dec' ]

export {
  NOTIFICATION_COLOR,
  SONG_LIST_EDIT_MODE,
  ROOM_NAME_FORMAT,
  GAME_MODE,
  AVATARS,
  USERNAME_FORMAT,
  VALID_SONG_TYPES,
  VALID_EMOJI_TYPES
}
