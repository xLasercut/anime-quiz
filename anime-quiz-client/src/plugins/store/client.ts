import {Module} from 'vuex'
import {ROUTES} from '../routing/routes'

const defaultClientState = () => {
  return {
    darkTheme: localStorage.darkTheme === 'true',
    view: ROUTES.LOGIN
  }
}

const client: Module<any, any> = {
  namespaced: true,
  state: defaultClientState,
  mutations: {
    CHANGE_THEME: (state): void => {
      state.darkTheme = !state.darkTheme
    }
  }
}

export {client}
