import { AdminStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnime } from '../../assets/shared/interfaces'

const DEFAULT_STATE: AdminStoreState = {
  animeList: [],
  animeInEdit: {
    anime_id: '',
    anime_name: []
  }
}

const admin: Module<AdminStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.RESET_STORE_STATE]: (state: AdminStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    },
    [MUTATIONS.SOCKET_ADMIN_UPDATE_ANIME_LIST]: (state: AdminStoreState, animeList: AqAnime[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.ADMIN_UPDATE_ANIME_ID]: (state: AdminStoreState, animeId: string) => {
      state.animeInEdit.anime_id = animeId
    },
    [MUTATIONS.ADMIN_UPDATE_ANIME_NAME]: (state: AdminStoreState, animeNames: string[]) => {
      state.animeInEdit.anime_name = animeNames
    }
  },
  getters: {}
}

export {
  admin
}
