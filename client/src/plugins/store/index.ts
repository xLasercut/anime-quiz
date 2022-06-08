import Vue from 'vue'
import Vuex from 'vuex'
import { client } from './client'
import { data } from './data'
import { game } from './game'
import { admin } from './admin'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    client,
    data,
    game,
    admin
  }
})

export {store}
