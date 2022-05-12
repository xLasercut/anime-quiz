import Vue from 'vue'
import Vuex from 'vuex'
import { client } from './client'
import { songList } from './song-list'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    client,
    songList
  }
})

export {store}
