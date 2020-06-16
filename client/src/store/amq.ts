import {Module} from 'vuex'
import {IAmqStoreState, IRooteStoreState} from '@/assets/interfaces'
import {IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'

function getDefaultState(): IAmqStoreState {
  return {
    playerList: [],
    settings: {
      songCount: 20,
      guessTime: 30,
      users: [],
      gameMode: 'normal',
      duplicate: false,
      selectTime: 20,
      leastPlayed: false
    }
  }
}

const amq: Module<IAmqStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    SOCKET_UPDATE_AMQ_PLAYER_LIST(state: IAmqStoreState, playerList: Array<IAmqPlayer>): void {
      state.playerList = playerList
    },
    SOCKET_UPDATE_AMQ_SETTINGS(state: IAmqStoreState, amqSettings: IAmqSettings): void {
      state.settings = amqSettings
    },
    RESET_STORE_STATE(state: IAmqStoreState): void {
      Object.assign(state, getDefaultState())
    }
  }
}

export default amq
