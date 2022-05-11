import {createStore} from 'vuex'
import {client} from './client'
import {songList} from './song-list'

const store = createStore({
  modules: {
    client,
    songList
  }
})

export {store}
