import { ClientStoreState, RootStoreState } from '../../assets/interfaces'
import { DIALOG_ROUTES, ROUTES } from '../routing/routes'
import { MUTATIONS } from './mutations'
import { Module } from 'vuex'
import { AqClientData } from '../../assets/shared/interfaces'

const DEFAULT_STATE: ClientStoreState = {
  view: ROUTES.LOGIN,
  dialogView: DIALOG_ROUTES.LOGIN_SETTINGS,
  username: '',
  avatar: '',
  admin: false,
  host: false
}

const client: Module<ClientStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.CHANGE_DIALOG_VIEW]: (state: ClientStoreState, route: string) => {
      state.dialogView = route
    },
    [MUTATIONS.CHANGE_VIEW]: (state: ClientStoreState, route: string) => {
      state.view = route
    },
    [MUTATIONS.SOCKET_UPDATE_CLIENT_DATA]: (state: ClientStoreState, clientData: AqClientData) => {
      state.username = clientData.username
      state.avatar = clientData.avatar
      state.admin = clientData.admin
      state.host = clientData.host
    }
  }
}

export {client}
