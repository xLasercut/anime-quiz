import Vue from 'vue'
import Vuex from 'vuex'
import {client} from './client'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    client
  }
})

export {store}
