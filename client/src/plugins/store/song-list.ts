import { RootStoreState, SongListStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqSong, AqUserSongs } from '../../assets/shared/interfaces'

const DEFAULT_STATE: SongListStoreState = {
  songList: [],
  animeList: [],
  songTitleList: [],
  userLists: []
}

const songList: Module<SongListStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_SONG_LIST]: (state: SongListStoreState, songList: AqSong[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST]: (state: SongListStoreState, animeList: string[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.SOCKET_UPDATE_SONG_TITLE_LIST]: (state: SongListStoreState, titleList: string[]) => {
      state.songTitleList = titleList
    },
    [MUTATIONS.SOCKET_UPDATE_USER_LISTS]: (state: SongListStoreState, userLists: AqUserSongs[]) => {
      state.userLists = userLists
    },
    [MUTATIONS.RESET_STORE_STATE]: (state: SongListStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    }
  },
  getters: {
    userList: (state: SongListStoreState): Function => (userId: string): string[] => {
      if (!userId) {
        return []
      }
      const filteredList = state.userLists.filter((userList) => {
        return userList.user_id === userId
      })
      if (filteredList.length > 0) {
        return filteredList[0].song_id
      }
      return []
    }
  }
}

export {
  songList
}