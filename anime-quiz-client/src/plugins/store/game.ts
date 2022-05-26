import { GameStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqGamePlayer } from '../../assets/shared/interfaces'

const DEFAULT_STATE: GameStoreState = {
  players: []
}

const game: Module<GameStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_GAME_PLAYERS]: (state: GameStoreState, players: AqGamePlayer[]): void => {
      state.players = players
    }
  }
}

export {
  game
}
