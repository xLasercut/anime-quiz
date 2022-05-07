import {Component} from 'vue'
import LoginPanel from '../../login/LoginPanel.vue'
import Login from '../../views/Login.vue'
import {store} from '../store'
import {ROUTES} from './routes'

const _PANEL_MAPPING: {[key: string]: Component} = {
  [ROUTES.LOGIN]: LoginPanel
}

const _VIEW_MAPPING: {[key: string]: Component} = {
  [ROUTES.LOGIN]: Login
}

function viewComponent(): any {
  return _VIEW_MAPPING[store.state.client.view]
}

function panelComponent(): any {
  return _PANEL_MAPPING[store.state.client.view]
}

export {
  viewComponent,
  panelComponent
}
