const STORE_SOCKET_EVENTS = {
  UPDATE_STORE_CLIENT_DATA: 'UPDATE_STORE_CLIENT_DATA',
  UPDATE_STORE_SONG_LIST: 'UPDATE_STORE_SONG_LIST',
  UPDATE_STORE_ANIME_LIST: 'UPDATE_STORE_ANIME_LIST',
  UPDATE_STORE_SONG_TITLES: 'UPDATE_STORE_SONG_TITLES',
  UPDATE_STORE_ANIME_NAMES: 'UPDATE_STORE_ANIME_NAMES'
};

const CLIENT_TO_SERVER_EVENTS = {
  AUTHORIZE_USER: 'AUTHORIZE_USER',
  JOIN_SONG_LIST_EDIT: 'JOIN_SONG_LIST_EDIT'
};

const SERVER_TO_CLIENT_EVENTS = {
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
  UPDATE_USER_SETTINGS: 'UPDATE_USER_SETTINGS'
};

const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  ...CLIENT_TO_SERVER_EVENTS,
  ...SERVER_TO_CLIENT_EVENTS,
  ...STORE_SOCKET_EVENTS
};

export { SOCKET_EVENTS };
