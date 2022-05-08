import {Component} from 'vue'
import LoginPanel from '../../login/LoginPanel.vue'
import Login from '../../views/Login.vue'
import LoginSettings from '../../login/LoginSettings.vue'
import Lobby from '../../views/Lobby.vue'
import LobbyPanel from '../../lobby/LobbyPanel.vue'
import {store} from '../store'
import {DIALOG_ROUTES, ROUTES} from './routes'

const _PANEL_MAPPING: {[key: string]: Component} = {
  [ROUTES.LOGIN]: LoginPanel,
  [ROUTES.LOBBY]: LobbyPanel
}

const _VIEW_MAPPING: {[key: string]: Component} = {
  [ROUTES.LOGIN]: Login,
  [ROUTES.LOBBY]: Lobby
}

const _DIALOG_MAPPING: {[key: string]: Component} = {
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
