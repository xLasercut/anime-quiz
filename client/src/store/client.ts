import {Module} from 'vuex'
import {IClientStoreState, IRooteStoreState} from '@/assets/interfaces'
import {ILoginMode} from '@/assets/types'

const DEFAULT_STATE: IClientStoreState = {
  admin: false,
  loginMode: 'game'
}

const client: Module<IClientStoreState, IRooteStoreState> = {
  state: DEFAULT_STATE,
  mutations: {
    CHANGE_LOGIN_MODE(state: IClientStoreState, mode: ILoginMode): void {
      state.loginMode = mode
    }
  }
}

export default client
