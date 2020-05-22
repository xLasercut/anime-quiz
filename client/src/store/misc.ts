import {IEmojiListFilter, IListStoreState, IMiscStoreState, IRooteStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IEmoji, ISong} from '../../../shared/interfaces/database'

function getDefaultState(): IMiscStoreState {
  return {
    emojiList: [],
    emojiListFilter: {
      command: ''
    }
  }
}

const misc: Module<IMiscStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    UPDATE_EMOJI_LIST_FILTER(state:IMiscStoreState, emojiListFilter: IEmojiListFilter): void {
      state.emojiListFilter = emojiListFilter
    },
    RESET_STORE_STATE(state: IMiscStoreState): void {
      Object.assign(state, getDefaultState())
    },
    SOCKET_UPDATE_EMOJI_LIST(state: IMiscStoreState, emojiList: Array<IEmoji>): void {
      state.emojiList = emojiList
    }
  },
  getters: {
    filteredEmojiList: (state: IMiscStoreState): Array<IEmoji> => {
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

export default misc
