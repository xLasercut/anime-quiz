import { AdminStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnime } from '../../assets/shared/interfaces'

const DEFAULT_STATE: AdminStoreState = {
  animeList: []
}

const admin: Module<AdminStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.RESET_STORE_STATE]: (state: AdminStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST_ADMIN]: (state: AdminStoreState, animeList: AqAnime[]) => {
      state.animeList = animeList
    }
  },
  getters: {}
}

export {
  admin
}
