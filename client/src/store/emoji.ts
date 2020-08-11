import {IEmojiListFilter, IEmojiStoreState, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IEmoji} from '../../../shared/interfaces/database'

function _getDefaultState(): IEmojiStoreState {
  return {
    emojiList: [],
    emojiListFilter: {
      command: ''
    }
  }
}

const emoji: Module<IEmojiStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    RESET_STORE_STATE(state: IEmojiStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_EMOJI_LIST_FILTER(state: IEmojiStoreState, emojiListFilter: IEmojiListFilter): void {
      state.emojiListFilter = emojiListFilter
    },
    SOCKET_UPDATE_EMOJI_LIST(state: IEmojiStoreState, emojiList: Array<IEmoji>): void {
      state.emojiList = emojiList
    }
  },
  getters: {
    filteredEmojiList: (state: IEmojiStoreState): Array<IEmoji> => {
      let commandFilter = state.emojiListFilter.command.trim().toLowerCase()

      return state.emojiList
        .filter((emoji: IEmoji) => {
          if (emoji.command.toLowerCase().includes(commandFilter)) {
            return emoji
          }
        })
        .sort((a: IEmoji, b: IEmoji) => {
          if (a.command > b.command) {
            return 1
          }
          return -1
        })

    }
  }
}

export default emoji
