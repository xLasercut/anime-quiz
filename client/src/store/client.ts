import {Module} from 'vuex'
import {IClientStoreState, IRooteStoreState} from '@/assets/interfaces'
import {ILoginMode, IRoomMode} from '@/assets/types'

function getDefaultState(): IClientStoreState {
  return {
    admin: false,
    loginMode: 'game',
    username: '',
    avatar: 'zero_2',
    roomMode: 'list'
  }
}

const client: Module<IClientStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    CHANGE_LOGIN_MODE(state: IClientStoreState, mode: ILoginMode): void {
      state.loginMode = mode
    },
    UPDATE_USERNAME(state: IClientStoreState, username: string): void {
      if (username) {
        state.username = username.trim()
      }
      else {
        state.username = ''
      }
    },
    UPDATE_AVATAR(state: IClientStoreState, avatar: string): void {
      state.avatar = avatar
    },
    UPDATE_ROOM_MODE(state: IClientStoreState, roomMode: IRoomMode): void {
      state.roomMode = roomMode
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
