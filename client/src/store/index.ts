import Vue from 'vue'
import Vuex from 'vuex'
import listPicker from '@/store/list-picker'
import client from '@/store/client'
import amq from '@/store/amq'
import misc from '@/store/misc'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    list: listPicker,
    client: client,
    amq: amq,
    misc: misc
  }
})
