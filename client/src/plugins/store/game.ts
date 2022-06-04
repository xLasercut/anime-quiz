import { GameStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqEmoji, AqGamePlayer, AqGameState } from '../../assets/shared/interfaces'

const DEFAULT_STATE: GameStoreState = {
  players: [],
  currentSong: {
    song_id: '',
    anime_id: [],
    anime_name: [],
    song_title: '',
    artist: '',
    src: '',
    type: ''
  },
  currentSongCount: 0,
  maxSongCount: 0,
  playing: false,
  emojiList: [],
  disableSettings: false
}

const game: Module<GameStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_GAME_PLAYERS]: (state: GameStoreState, players: AqGamePlayer[]) => {
      state.players = players
    },
    [MUTATIONS.SOCKET_UPDATE_GAME_STATE]: (state: GameStoreState, gameState: AqGameState) => {
      state.currentSong = gameState.currentSong
      state.playing = gameState.playing
      state.maxSongCount = gameState.maxSongCount
      state.currentSongCount = gameState.currentSongCount
    },
    [MUTATIONS.SOCKET_UPDATE_EMOJI_LIST]: (state: GameStoreState, emojiList: AqEmoji[]) => {
      state.emojiList = emojiList
    },
    [MUTATIONS.RESET_STORE_STATE]: (state: GameStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    },
    [MUTATIONS.EDIT_DISABLE_GAME_SETTINGS]: (state: GameStoreState, disabled: boolean) => {
      state.disableSettings = disabled
    }
  },
  getters: {
    isYoutubeVideo: (state: GameStoreState): boolean => {
      return state.currentSong.src.includes('youtube')
    },
    emojiList: (state: GameStoreState): AqEmoji[] => {
      return [...state.emojiList].sort((a, b) => {
        const commandA = a.command
        const commandB = b.command

        if (commandA === commandB) {
          return 0
        } else if (commandA > commandB) {
          return 1
        }
        return -1
      })
    }
  }
}

export {
  game
}
