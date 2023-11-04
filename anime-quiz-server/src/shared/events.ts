const STORE_SOCKET_EVENTS = {
  UPDATE_STORE_CLIENT_DATA: 'UPDATE_STORE_CLIENT_DATA',
  UPDATE_STORE_SONG_LIST: 'UPDATE_STORE_SONG_LIST',
  UPDATE_STORE_ANIME_LIST: 'UPDATE_STORE_ANIME_LIST',
  UPDATE_STORE_SONG_TITLES: 'UPDATE_STORE_SONG_TITLES',
  UPDATE_STORE_ANIME_NAMES: 'UPDATE_STORE_ANIME_NAMES',
  UPDATE_STORE_USER_SONG_LIST: 'UPDATE_STORE_USER_SONG_LIST',
  UPDATE_STORE_USER_LIST: 'UPDATE_STORE_USER_LIST',
  UPDATE_STORE_EMOJI_LIST: 'UPDATE_STORE_EMOJI_LIST',
  UPDATE_STORE_DATA_VERSION: 'UPDATE_STORE_DATA_VERSION'
};

const CLIENT_TO_SERVER_EVENTS = {
  AUTHORIZE_USER: 'AUTHORIZE_USER',
  ADMIN_NEW_USER: 'ADMIN_NEW_USER',
  ADMIN_EDIT_USER: 'ADMIN_EDIT_USER',
  ADMIN_DELETE_USER: 'ADMIN_DELETE_USER',
  UPDATE_USER_SETTINGS: 'UPDATE_USER_SETTINGS',
  ADD_USER_SONGS: 'ADD_USER_SONGS',
  REMOVE_USER_SONGS: 'REMOVE_USER_SONGS',
  ADMIN_NEW_ANIME: 'ADMIN_NEW_ANIME',
  ADMIN_EDIT_ANIME: 'ADMIN_EDIT_ANIME',
  ADMIN_DELETE_ANIME: 'ADMIN_DELETE_ANIME',
  ADMIN_NEW_SONG: 'ADMIN_NEW_SONG',
  ADMIN_EDIT_SONG: 'ADMIN_EDIT_SONG',
  ADMIN_DELETE_SONG: 'ADMIN_DELETE_SONG',
  ADMIN_NEW_EMOJI: 'ADMIN_NEW_EMOJI',
  ADMIN_EDIT_EMOJI: 'ADMIN_EDIT_EMOJI',
  ADMIN_DELETE_EMOJI: 'ADMIN_DELETE_EMOJI',
  GET_ROOM_LIST: 'GET_ROOM_LIST',
  NEW_GAME_ROOM: 'NEW_GAME_ROOM',
  LEAVE_ALL_ROOMS: 'LEAVE_ALL_ROOMS',
  SEND_GAME_CHAT: 'SEND_GAME_CHAT',
  JOIN_GAME_ROOM: 'JOIN_GAME_ROOM',
  GET_GAME_ROOM_SETTINGS: 'GET_GAME_ROOM_SETTINGS',
  UPDATE_SERVER_GAME_ROOM_SETTINGS: 'UPDATE_SERVER_GAME_ROOM_SETTINGS'
};

const SERVER_TO_CLIENT_EVENTS = {
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
  UPDATE_ROOM_LIST: 'UPDATE_ROOM_LIST',
  UPDATE_GAME_CHAT: 'UPDATE_GAME_CHAT',
  UPDATE_CLIENT_GAME_ROOM_SETTINGS: 'UPDATE_CLIENT_GAME_ROOM_SETTINGS'
};

const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',

  ...CLIENT_TO_SERVER_EVENTS,
  ...SERVER_TO_CLIENT_EVENTS,
  ...STORE_SOCKET_EVENTS
} as const;

export { SOCKET_EVENTS };
