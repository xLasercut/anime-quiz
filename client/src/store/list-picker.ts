import {Module} from 'vuex'
import {IListStoreState, IRooteStoreState, ISongListFilter} from '@/assets/interfaces'
import {IChoices, ISong} from '../../../shared/interfaces/database'

function getDefaultState(): IListStoreState {
  return {
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
}

const listPicker: Module<IListStoreState, IRooteStoreState> = {
  state: getDefaultState(),
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
    },
    RESET_STORE_STATE(state: IListStoreState): void {
      Object.assign(state, getDefaultState())
    }
  },
  getters: {
    filteredSongList: (state: IListStoreState): Array<ISong> => {
      let typeFilter = ''
      let animeFilter = state.songListFilter.anime.trim().toLowerCase()
      let titleFilter = state.songListFilter.title.trim().toLowerCase()
      if (state.songListFilter.type !== 'All') {
        typeFilter = state.songListFilter.type.trim().toLowerCase()
      }

      return state.songList
        .filter((song: ISong) => {
          if (song.anime.join(',').toLowerCase().includes(animeFilter) &&
            song.title.toLowerCase().includes(titleFilter) &&
            song.type.toLowerCase().includes(typeFilter)) {
            return song
          }
        })
        .sort((a: ISong, b: ISong) => {
          let animeA = a.anime[0]
          let animeB = b.anime[0]
          let titleA = a.title
          let titleB = b.title

          if (animeA === animeB) {
            if (titleA > titleB) {
              return 1
            }
            else if (titleA < titleB) {
              return -1
            }
            return 0
          }
          else if (animeA > animeB) {
            return 1
          }
          return -1
        })
    }
  }
}

export default listPicker
