import Vue from 'vue'
import Vuex from 'vuex'
import { client } from './client'
import { songList } from './song-list'
import { game } from './game'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    client,
    songList,
    game
  }
})

export {store}
