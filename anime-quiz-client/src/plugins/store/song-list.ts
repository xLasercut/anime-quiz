import { RootStoreState, SongListStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnimeSerialised, AqSongSerialised } from '../../assets/shared/interfaces'

const DEFAULT_STATE: SongListStoreState = {
  songList: [],
  currentPage: 1,
  itemsPerPage: 10,
  animeFilter: '',
  songTitleFilter: '',
  songTypeFilter: '',
  animeList: [],
  songTitleList: []
}

const songList: Module<SongListStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_SONG_LIST]: (state: SongListStoreState, songList: AqSongSerialised[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST]: (state: SongListStoreState, animeList: AqAnimeSerialised[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.SOCKET_UPDATE_SONG_TITLE_LIST]: (state: SongListStoreState, titleList: string[]) => {
      state.songTitleList = titleList
    },
    [MUTATIONS.UPDATE_SONG_LIST_ANIME_FILTER]: (state: SongListStoreState, filter: string) => {
      state.animeFilter = filter
    },
    [MUTATIONS.UPDATE_SONG_LIST_TITLE_FILTER]: (state: SongListStoreState, filter: string) => {
      state.songTitleFilter = filter
    },
    [MUTATIONS.UPDATE_SONG_LIST_TYPE_FILTER]: (state: SongListStoreState, filter: string) => {
      state.songTypeFilter = filter
    }
  },
  getters: {
    filteredSongList: (state: SongListStoreState): AqSongSerialised[] => {
      return state.songList.filter((song) => {
        return song.anime_name.join(',').toLowerCase().includes(state.animeFilter.toLowerCase()) &&
          song.song_title.toLowerCase().includes(state.songTitleFilter.toLowerCase()) &&
          song.type.toLowerCase().includes(state.songTypeFilter.toLowerCase())
      })
    }
  }
}

export {
  songList
}
