import {Module} from 'vuex'
import {IClientStoreState, IRooteStoreState} from '@/assets/interfaces'
import {ILoginMode} from '@/assets/types'

function getDefaultState(): IClientStoreState {
  return {
    admin: false,
    loginMode: 'game'
  }
}

const client: Module<IClientStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    CHANGE_LOGIN_MODE(state: IClientStoreState, mode: ILoginMode): void {
      state.loginMode = mode
    },
    SOCKET_UPDATE_ADMIN(state: IClientStoreState, admin: boolean): void {
      state.admin = admin
    },
    RESET_STORE_STATE(state: IClientStoreState): void {
      Object.assign(state, getDefaultState())
    }
  }
}

export default client
