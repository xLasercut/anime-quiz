import {Module} from 'vuex'
import {DIALOG_ROUTES, ROUTES} from '../routing/routes'
import {MUTATIONS} from './mutations'
import {ClientStoreState, RootStoreState} from '../../assets/interfaces'

const defaultClientState = (): ClientStoreState => {
  return {
    view: ROUTES.LOGIN,
    dialogView: DIALOG_ROUTES.LOGIN_SETTINGS
  }
}

const client: Module<ClientStoreState, RootStoreState> = {
  state: defaultClientState,
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
