import { Component } from 'vue/types/options'
import { DIALOG_ROUTES, ROUTES } from './routes'
import { store } from '../store'
import Login from '../../views/Login.vue'
import LoginSettings from '../../components/login/LoginSettings.vue'
import LoginPanel from '../../components/login/LoginPanel.vue'
import Lobby from '../../views/Lobby.vue'
import LobbyPanel from '../../components/lobby/LobbyPanel.vue'
import SongListPanel from '../../components/song-list/SongListPanel.vue'
import SongList from '../../views/SongList.vue'

const _PANEL_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.LOBBY]: LobbyPanel,
  [ROUTES.SONG_LIST]: SongListPanel
}

const _VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby,
  [ROUTES.SONG_LIST]: SongList
}

const _DIALOG_MAPPING: { [key: string]: Component } = {
  [DIALOG_ROUTES.LOGIN_SETTINGS]: LoginSettings
}

function viewComponent(): any {
  return _VIEW_MAPPING[store.state.client.view]
}

function panelComponent(): any {
  return _PANEL_MAPPING[store.state.client.view]
}

function dialogComponent(): any {
  return _DIALOG_MAPPING[store.state.client.dialogView]
}

export {
  viewComponent,
  panelComponent,
  dialogComponent
}
