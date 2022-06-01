const CLIENT_CONSTANTS = {
  PAGE_HEIGHT: 'calc(100vh - 67px)',
  TABLE_HEIGHT: 'calc(100vh - 252px)',
  CHAT_MAX_WIDTH: '300'
}

const LOCAL_STORAGE_CONSTANTS = {
  DARK_THEME: 'DARK_THEME',
  GAME_SERVER: 'GAME_SERVER',
  AQ_USERNAME: 'AQ_USERNAME',
  AQ_AVATAR: 'AQ_AVATAR'
}

const SONG_TYPES = [
  { text: 'OP', value: 'OP' },
  { text: 'ED', value: 'ED' },
  { text: 'INSERT', value: 'INSERT' }
]

const EMOJI_TYPES = [
  { text: 'IMG', value: 'img' },
  { text: 'DEC', value: 'dec' }
]

export {
  CLIENT_CONSTANTS,
  LOCAL_STORAGE_CONSTANTS,
  SONG_TYPES,
  EMOJI_TYPES
}
