import { SHARED_EVENTS } from '../../assets/shared/events'

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
  SOCKET_ADMIN_UPDATE_ANIME_LIST: `SOCKET_${SHARED_EVENTS.ADMIN_UPDATE_ANIME_LIST}`,
  RESET_STORE_STATE: 'RESET_STORE_STATE',
  ADMIN_UPDATE_ANIME_ID: 'ADMIN_UPDATE_ANIME_ID',
  ADMIN_UPDATE_ANIME_NAME: 'ADMIN_UPDATE_ANIME_NAME'
}

export {
  MUTATIONS
}
