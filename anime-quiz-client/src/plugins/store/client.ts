import {Module} from 'vuex'
import {DIALOG_ROUTES, ROUTES} from '../routing/routes'
import {MUTATIONS} from './mutations'

const defaultClientState = () => {
  return {
    darkTheme: localStorage.darkTheme === 'true',
    view: ROUTES.LOGIN,
    dialogView: DIALOG_ROUTES.LOGIN_SETTINGS
  }
}

const client: Module<any, any> = {
  state: defaultClientState,
  mutations: {
    [MUTATIONS.CHANGE_THEME]: (state): void => {
      state.darkTheme = !state.darkTheme
    },
    [MUTATIONS.CHANGE_DIALOG_VIEW]: (state, route: string): void => {
      state.dialogView = route
    }
  }
}

export {client}
