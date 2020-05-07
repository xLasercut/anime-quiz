import {Module} from 'vuex'
import {IListStoreState, IRooteStoreState, ISongListFilter} from '@/assets/interfaces'
import {IChoices, ISong} from '../../../shared/interfaces/database'

const DEFAULT_STATE: IListStoreState = {
  songList: [],
  users: [],
  userSongs: new Set(),
  currentUser: '',
  choices: {
    anime: [],
    title: []
  },
  songListFilter: {
    title: '',
    anime: '',
    type: 'All'
  }
}

const listPicker: Module<IListStoreState, IRooteStoreState> = {
  state: DEFAULT_STATE,
  mutations: {
    SOCKET_UPDATE_SONG_LIST(state: IListStoreState, songList: Array<ISong>): void {
      state.songList = songList
    },
    SOCKET_UPDATE_USERS(state: IListStoreState, users: Array<string>): void {
      state.users = users
    },
    SOCKET_UPDATE_CHOICES(state: IListStoreState, choices: IChoices): void {
      state.choices = choices
    },
    SOCKET_UPDATE_USER_SONGS(state: IListStoreState, userSongs: Array<string>): void {
      state.userSongs = new Set(userSongs)
    },
    UPDATE_SONG_LIST_FILTER(state: IListStoreState, songListFilter: ISongListFilter): void {
      state.songListFilter = songListFilter
    },
    UPDATE_CURRENT_USER(state: IListStoreState, user: string): void {
      state.currentUser = user
      if (!user) {
        state.userSongs = new Set()
      }
    }
  },
  getters: {
    filteredSongList: (state: IListStoreState): Array<ISong> => {
      let animeFilter = ''
      let titleFilter = ''
      let typeFilter = ''

      if (state.songListFilter.anime) {
        animeFilter = state.songListFilter.anime.trim().toLowerCase()
      }

      if (state.songListFilter.title) {
        titleFilter = state.songListFilter.title.trim().toLowerCase()
      }

      if (state.songListFilter.type && state.songListFilter.type !== 'All') {
        typeFilter = state.songListFilter.type.trim().toLowerCase()
      }

      return state.songList.filter((song: ISong) => {
        let anime = song.anime.join(',').toLowerCase()
        let title = song.title.toLowerCase()
        let type = song.type.toLowerCase()

        if (anime.includes(animeFilter) &&
          title.includes(titleFilter) &&
          type.includes(typeFilter)) {
          return song
        }
      })
    }
  }
}

export default listPicker
