const LOCAL_STORAGE_CONSTANTS = {
  DARK_THEME: 'DARK_THEME',
  GAME_SERVER: 'GAME_SERVER',
  AQ_VOLUME: 'AQ_VOLUME',
  OAUTH_STATE: 'OAUTH_STATE',
  DATA_VERSION: 'DATA_VERSION',
  SONG_LIST: 'SONG_LIST',
  ANIME_LIST: 'ANIME_LIST',
  ANIME_NAMES: 'ANIME_NAMES',
  SONG_TITLES: 'SONG_TITLES',
  EMOJI_LIST: 'EMOJI_LIST'
};

const CLIENT_CONSTANTS = {
  SONG_LIST_EDIT_TABLE_HEIGHT: 'calc(100vh - 262px)',
  ADMIN_TABLE_HEIGHT: 'calc(100vh - 202px)',
  PAGE_HEIGHT: 'calc(100vh - 72px)',
  GAME_SONG_PICKER_TABLE_HEIGHT: '400px',
  MUSIC_PLAYER_TABLE_HEIGHT: 'calc(100vh - 442px)'
};

const SONG_LIST_EDIT_MODE = {
  ADD: 'add',
  REMOVE: 'remove',
  NONE: 'none'
};

const DATABASE_EDIT_MODE = {
  NEW: 'new',
  EDIT: 'edit',
  DELETE: 'delete'
};

const CLIENT_VERSION = `${import.meta.env.VITE_CLIENT_VERSION}`;

export { LOCAL_STORAGE_CONSTANTS, CLIENT_CONSTANTS, SONG_LIST_EDIT_MODE, DATABASE_EDIT_MODE, CLIENT_VERSION };
