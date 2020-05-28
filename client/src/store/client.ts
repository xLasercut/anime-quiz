import {Module} from 'vuex'
import {IAvatar, IClientStoreState, IRooteStoreState} from '@/assets/interfaces'
import {ILoginMode, IRoomMode} from '@/assets/types'
import {IRoomSerial} from '../../../shared/interfaces/game'

function getDefaultState(): IClientStoreState {
  return {
    admin: false,
    loginMode: 'game',
    username: '',
    avatar: 'zero_2',
    roomMode: 'list',
    roomList: [],
    avatarMap: {
      'zero_2': 'https://i.imgur.com/qQ0Fkkx.png',
      'initial_d': 'https://i.imgur.com/fk44rTD.png',
      'misaka': 'https://i.imgur.com/eZ6FZcr.png',
      'eva_unit_1': 'https://i.imgur.com/aqld5ou.png',
      'taj': 'https://i.imgur.com/08X3kjC.png',
      'alphonse': 'https://i.imgur.com/PerwiGF.png',
      'horo': 'https://i.imgur.com/oOiDAFl.png',
      'madoka': 'https://i.imgur.com/iGPVIAN.png',
      'lelouch': 'https://i.imgur.com/mB0IKty.png',
      'miyu': 'https://i.imgur.com/Jvi0FoN.png',
      'rawr': 'https://i.imgur.com/t03jCAX.png',
      'pikachu': 'https://i.imgur.com/QoEzMPR.jpg',
      'eren': 'https://i.imgur.com/5Dip9VY.jpg',
      'jaden': 'https://i.imgur.com/emAT9yb.png',
      'yugi': 'https://i.imgur.com/Gfb2pnD.png'
    }
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
    SOCKET_UPDATE_ROOM_LIST(state: IClientStoreState, roomList: Array<IRoomSerial>): void {
      state.roomList = roomList
    },
    RESET_STORE_STATE(state: IClientStoreState): void {
      Object.assign(state, getDefaultState())
    }
  },
  getters: {
    avatarImage: (state: IClientStoreState) => (avatar: string): string => {
      if (avatar in state.avatarMap) {
        return state.avatarMap[avatar]
      }
      return 'img/dead_link.jpg'
    },
    avatarList: (state: IClientStoreState): Array<IAvatar> => {
      let avatarList = []
      for (let avatar in state.avatarMap) {
        avatarList.push({
          avatar: avatar,
          src: state.avatarMap[avatar]
        })
      }
      return avatarList
    }
  }
}

export default client
