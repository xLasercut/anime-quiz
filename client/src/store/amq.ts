import {Module} from 'vuex'
import {IAmqStoreState, IRooteStoreState} from '@/assets/interfaces'
import {IAmqPlayer} from '../../../shared/interfaces/amq'

function getDefaultState(): IAmqStoreState {
  return {
    playerList: []
  }
}

const amq: Module<IAmqStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    SOCKET_UPDATE_AMQ_PLAYER_LIST(state: IAmqStoreState, playerList: Array<IAmqPlayer>): void {
      state.playerList = playerList
      console.log(playerList)
    },
    RESET_STORE_STATE(state: IAmqStoreState): void {
      Object.assign(state, getDefaultState())
    }
  }
}

export default amq
