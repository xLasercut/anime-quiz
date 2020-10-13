import {IAmqSongListFilter, IAmqStoreState, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IAmqChoices, IAmqSong} from '../../../shared/interfaces/database'
import {IAmqGameState, IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'

function _getDefaultState(): IAmqStoreState {
  return {
    host: false,
    playerList: [],
    settings: {
      songCount: 20,
      guessTime: 30,
      users: [],
      gameMode: 'normal',
      duplicate: false,
      leastPlayed: false,
      quickDraw: false
    },
    gameState: {
      currentSong: {
        anime: [''],
        title: '',
        artist: '',
        src: '',
        type: '',
        songId: ''
      },
      maxSongCount: 0,
      currentSongCount: 0,
      playing: false,
      startPosition: 0
    },
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


const amq: Module<IAmqStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    RESET_STORE_STATE(state: IAmqStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_AMQ_SONG_LIST_FILTER(state: IAmqStoreState, songListFilter: IAmqSongListFilter): void {
      state.songListFilter = songListFilter
    },
    UPDATE_AMQ_CURRENT_USER(state: IAmqStoreState, user: string): void {
      state.currentUser = user
      if (!user) {
        state.userSongs = new Set()
      }
    },
    SOCKET_UPDATE_AMQ_SONG_LIST(state: IAmqStoreState, songList: Array<IAmqSong>): void {
      state.songList = songList
    },
    SOCKET_UPDATE_AMQ_USERS(state: IAmqStoreState, users: Array<string>): void {
      state.users = users
    },
    SOCKET_UPDATE_AMQ_CHOICES(state: IAmqStoreState, choices: IAmqChoices): void {
      state.choices = choices
    },
    SOCKET_UPDATE_AMQ_USER_SONGS(state: IAmqStoreState, userSongs: Array<string>): void {
      state.userSongs = new Set(userSongs)
    },
    SOCKET_UPDATE_AMQ_HOST(state: IAmqStoreState, host: boolean): void {
      state.host = host
    },
    SOCKET_UPDATE_AMQ_PLAYER_LIST(state: IAmqStoreState, playerList: Array<IAmqPlayer>): void {
      state.playerList = playerList
    },
    SOCKET_UPDATE_AMQ_SETTINGS(state: IAmqStoreState, settings: IAmqSettings): void {
      state.settings = settings
    },
    SOCKET_UPDATE_AMQ_GAME_STATE(state: IAmqStoreState, gameState: IAmqGameState): void {
      state.gameState = gameState
    }
  },
  getters: {
    filteredAmqSongList: (state: IAmqStoreState): Array<IAmqSong> => {
      let typeFilter = ''
      let animeFilter = state.songListFilter.anime.trim().toLowerCase()
      let titleFilter = state.songListFilter.title.trim().toLowerCase()
      if (state.songListFilter.type !== 'All') {
        typeFilter = state.songListFilter.type.trim().toLowerCase()
      }

      return state.songList
        .filter((song: IAmqSong) => {
          if (song.anime.join(',').toLowerCase().includes(animeFilter) &&
            song.title.toLowerCase().includes(titleFilter) &&
            song.type.toLowerCase().includes(typeFilter)) {
            return song
          }
        })
        .sort((a: IAmqSong, b: IAmqSong) => {
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
    },
    isAmqVideoType: (state: IAmqStoreState) => (videoType: string): boolean => {
      let actualType = 'normal'

      if (state.gameState.currentSong.src.includes('youtube')) {
        actualType = 'youtube'
      }

      return actualType === videoType
    },
    amqStartPosition: (state: IAmqStoreState) => (videoDuration: number): number => {
      let maxStart = Math.floor(videoDuration - state.settings.guessTime)
      if (maxStart > 0) {
        return Math.floor(state.gameState.startPosition * maxStart)
      }
      return 0
    }
  }
}

export default amq
