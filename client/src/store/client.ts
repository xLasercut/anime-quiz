import {IAvatar, IClientStoreState, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IRoomSerial} from '../../../shared/interfaces/game'
import {IViewCommand} from '@/assets/types'

function _getDefaultState(): IClientStoreState {
  return {
    admin: false,
    view: 'login',
    username: localStorage.username || '',
    avatar: localStorage.avatar || 'zero_2',
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
    },
    roomList: []
  }
}

const client: Module<IClientStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    UPDATE_USERNAME(state: IClientStoreState, username: string): void {
      state.username = username
    },
    UPDATE_AVATAR(state: IClientStoreState, avatar: string): void {
      state.avatar = avatar
    },
    UPDATE_VIEW(state: IClientStoreState, view: string): void {
      state.view = view
    },
    RESET_CLIENT_STORE_STATE(state: IClientStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_ROOM_LIST(state: IClientStoreState, roomList: Array<IRoomSerial>): void {
      state.roomList = roomList
    },
    SOCKET_UPDATE_ADMIN(state: IClientStoreState, admin: boolean): void {
      state.admin = admin
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
    },
    viewCommand: (state: IClientStoreState) => (type: IViewCommand): string => {
      let command = state.view.replace('_room_list', '')
      switch (type) {
        case 'join-new':
          return `JOIN_${command}_NEW`.toUpperCase()
        case 'join-exist':
          return `JOIN_${command}_EXIST`.toUpperCase()
        case 'update-room-list':
          return `UPDATE_${command}_ROOM_LIST`.toUpperCase()
        case 'get-room-list':
          return `GET_${command}_ROOM_LIST`.toUpperCase()
        case 'command':
          return command
        case 'chat':
          return `${command}_CHAT`.toUpperCase()
        default:
          return ''
      }
    }
  }
}

export default client
