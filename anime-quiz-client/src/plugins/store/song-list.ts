import {Module} from 'vuex'
import {MUTATIONS} from './mutations'
import {AqAnimeSerialised, AqSongSerialised} from '../../assets/shared/interfaces'
import {RootStoreState, SongListStoreState} from '../../assets/interfaces'

const defaultSongListState = (): SongListStoreState => {
  return {
    songList: [],
    currentPage: 1,
    itemsPerPage: 10,
    animeFilter: '',
    animeList: []
  }
}

function filterSongList(state: SongListStoreState): AqSongSerialised[] {
  return state.songList.filter(song => {
    return song.anime_name.join(',').toLowerCase().includes(state.animeFilter)
  })
}

const songList: Module<SongListStoreState, RootStoreState> = {
  state: defaultSongListState,
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_SONG_LIST]: (state: SongListStoreState, songList: AqSongSerialised[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST]: (state: SongListStoreState, animeList: AqAnimeSerialised[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.UPDATE_SONG_LIST_CURRENT_PAGE]: (state: SongListStoreState, currentPage: number) => {
      state.currentPage = currentPage
    },
    [MUTATIONS.UPDATE_SONG_LIST_ANIME_FILTER]: (state: SongListStoreState, filter: string) => {
      state.animeFilter = filter || ''
    }
  },
  getters: {
    songList: (state: SongListStoreState): AqSongSerialised[] => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage
      const endIndex = startIndex + state.itemsPerPage
      return filterSongList(state).slice(startIndex, endIndex)
    },
    maxPage: (state: SongListStoreState): number => {
      return Math.ceil(filterSongList(state).length / state.itemsPerPage)
    }
  }
}

export {
  songList
}
