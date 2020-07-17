import {Module} from 'vuex'
import {IAmqStoreState, IRooteStoreState} from '@/assets/interfaces'
import {IAmqGameState, IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'

function getDefaultState(): IAmqStoreState {
  return {
    host: false,
    playerList: [],
    settings: {
      songCount: 20,
      guessTime: 30,
      users: [],
      gameMode: 'normal',
      duplicate: false,
      selectTime: 20,
      leastPlayed: false
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
    }
  }
}

const amq: Module<IAmqStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    SOCKET_UPDATE_AMQ_PLAYER_LIST(state: IAmqStoreState, playerList: Array<IAmqPlayer>): void {
      state.playerList = playerList
    },
    SOCKET_UPDATE_AMQ_SETTINGS(state: IAmqStoreState, amqSettings: IAmqSettings): void {
      state.settings = amqSettings
    },
    SOCKET_UPDATE_AMQ_GAME_STATE(state: IAmqStoreState, amqGameState: IAmqGameState): void {
      state.gameState = amqGameState
    },
    SOCKET_UPDATE_AMQ_HOST(state: IAmqStoreState, host: boolean): void {
      state.host = host
    },
    RESET_STORE_STATE(state: IAmqStoreState): void {
      Object.assign(state, getDefaultState())
    }
  },
  getters: {
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
