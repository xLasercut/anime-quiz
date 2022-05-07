import {createStore} from 'vuex'
import {client} from './client'

const store = createStore({
  modules: {
    client
  }
})

export {store}
