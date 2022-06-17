import { SHARED_EVENTS } from '../../assets/shared/events';

const MUTATIONS = {
  CHANGE_DIALOG_VIEW: 'CHANGE_DIALOG_VIEW',
  CHANGE_VIEW: 'CHANGE_VIEW',
  SOCKET_UPDATE_SONG_LIST: `SOCKET_${SHARED_EVENTS.UPDATE_SONG_LIST}`,
  SOCKET_UPDATE_ANIME_LIST: `SOCKET_${SHARED_EVENTS.UPDATE_ANIME_LIST}`,
  SOCKET_UPDATE_SONG_TITLE_LIST: `SOCKET_${SHARED_EVENTS.UPDATE_SONG_TITLE_LIST}`,
  SOCKET_UPDATE_USER_LISTS: `SOCKET_${SHARED_EVENTS.UPDATE_USER_LISTS}`,
  SOCKET_UPDATE_CLIENT_DATA: `SOCKET_${SHARED_EVENTS.UPDATE_CLIENT_DATA}`,
  SOCKET_UPDATE_GAME_PLAYERS: `SOCKET_${SHARED_EVENTS.UPDATE_GAME_PLAYERS}`,
  SOCKET_UPDATE_GAME_STATE: `SOCKET_${SHARED_EVENTS.UPDATE_GAME_STATE}`,
  SOCKET_UPDATE_EMOJI_LIST: `SOCKET_${SHARED_EVENTS.UPDATE_EMOJI_LIST}`,
  RESET_STORE_STATE: 'RESET_STORE_STATE',
  RESET_CLIENT_STORE_STATE: 'RESET_CLIENT_STORE_STATE',
  ADMIN_UPDATE_ANIME_ID: 'ADMIN_UPDATE_ANIME_ID',
  ADMIN_UPDATE_ANIME_NAME: 'ADMIN_UPDATE_ANIME_NAME',
  ADMIN_UPDATE_SONG_ID: 'ADMIN_UPDATE_SONG_ID',
  ADMIN_UPDATE_SONG_TITLE: 'ADMIN_UPDATE_SONG_TITLE',
  ADMIN_UPDATE_SONG_SRC: 'ADMIN_UPDATE_SONG_SRC',
  ADMIN_UPDATE_SONG_TYPE: 'ADMIN_UPDATE_SONG_TYPE',
  ADMIN_UPDATE_SONG_ARTIST: 'ADMIN_UPDATE_SONG_ARTIST',
  ADMIN_UPDATE_SONG_ANIME_ID: 'ADMIN_UPDATE_SONG_ANIME_ID',
  ADMIN_UPDATE_SONG_ANIME_NAME: 'ADMIN_UPDATE_SONG_ANIME_NAME',
  ADMIN_UPDATE_EMOJI_COMMAND: 'ADMIN_UPDATE_EMOJI_COMMAND',
  ADMIN_UPDATE_EMOJI_SRC: 'ADMIN_UPDATE_EMOJI_SRC',
  ADMIN_UPDATE_EMOJI_TYPE: 'ADMIN_UPDATE_EMOJI_TYPE',
  ADMIN_UPDATE_EMOJI_ID: 'ADMIN_UPDATE_EMOJI_ID',
  EDIT_DISABLE_GAME_SETTINGS: 'EDIT_DISABLE_GAME_SETTINGS',
  ADMIN_UPDATE_USER_ID: 'ADMIN_UPDATE_USER_ID',
  ADMIN_UPDATE_USER_NAME: 'ADMIN_UPDATE_USER_NAME',
  UPDATE_VOLUME: 'UPDATE_VOLUME'
};

export { MUTATIONS };
