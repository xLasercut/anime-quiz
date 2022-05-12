import { ClientStoreState, RootStoreState } from '../../assets/interfaces'
import { DIALOG_ROUTES, ROUTES } from '../routing/routes'
import { MUTATIONS } from './mutations'
import { Module } from 'vuex'

const DEFAULT_STATE: ClientStoreState = {
  view: ROUTES.LOGIN,
  dialogView: DIALOG_ROUTES.LOGIN_SETTINGS
}

const client: Module<ClientStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.CHANGE_DIALOG_VIEW]: (state: ClientStoreState, route: string): void => {
      state.dialogView = route
    },
    [MUTATIONS.CHANGE_VIEW]: (state: ClientStoreState, route: string): void => {
      state.view = route
    }
  }
}

export {client}
