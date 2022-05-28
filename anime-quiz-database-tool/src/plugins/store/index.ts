import Vue from 'vue'
import Vuex from 'vuex'
import { ROUTES } from '../routing/routes'
import { MUTATIONS } from './mutations'
import { DbPaths } from '../../assets/interfaces'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userDbPath: '',
    songDbPath: '',
    view: ROUTES.FILE_SELECT
  },
  getters: {
  },
  mutations: {
    [MUTATIONS.CHANGE_VIEW]: (state, view: string) => {
      state.view = view
    },
    [MUTATIONS.UPDATE_DB_PATH]: (state, paths: DbPaths) => {
      state.userDbPath = paths.userDbPath
      state.songDbPath = paths.songDbPath
    }
  }
})

export {
  store
}
