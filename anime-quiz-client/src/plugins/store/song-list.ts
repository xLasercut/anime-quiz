import { RootStoreState, SongListStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnimeSerialised, AqSongSerialised } from '../../assets/shared/interfaces'

const DEFAULT_STATE: SongListStoreState = {
  songList: [],
  currentPage: 1,
  itemsPerPage: 10,
  animeFilter: '',
  animeList: []
}

const songList: Module<SongListStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_SONG_LIST]: (state: SongListStoreState, songList: AqSongSerialised[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST]: (state: SongListStoreState, animeList: AqAnimeSerialised[]) => {
      state.animeList = animeList
    }
  }
}

export {
  songList
}
