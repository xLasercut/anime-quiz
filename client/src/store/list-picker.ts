import {Module} from 'vuex'
import {IListStoreState, IRooteStoreState} from '@/assets/interfaces'

const DEFAULT_STATE: IListStoreState = {
  songList: [],
  users: [],
  userSongs: new Set(),
  currentUser: '',
  choices: {
    anime: [],
    title: []
  }
}

const listPicker: Module<IListStoreState, IRooteStoreState> = {
  state: DEFAULT_STATE,
  mutations: {

  }
}

export default listPicker
