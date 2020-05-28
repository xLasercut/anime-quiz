import {IChatBotListFilter, IEmojiListFilter, IMiscStoreState, IRooteStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IChatBot, IEmoji} from '../../../shared/interfaces/database'
import {IMiscMode} from '@/assets/types'

function getDefaultState(): IMiscStoreState {
  return {
    miscMode: 'emoji',
    emojiList: [],
    emojiListFilter: {
      command: ''
    },
    chatBotList: [],
    chatBotListFilter: {
      regex: ''
    }
  }
}

const misc: Module<IMiscStoreState, IRooteStoreState> = {
  state: getDefaultState(),
  mutations: {
    UPDATE_MISC_MODE(state: IMiscStoreState, mode: IMiscMode): void {
      state.miscMode = mode
    },
    UPDATE_EMOJI_LIST_FILTER(state: IMiscStoreState, emojiListFilter: IEmojiListFilter): void {
      state.emojiListFilter = emojiListFilter
    },
    UPDATE_CHAT_BOT_LIST_FILTER(state: IMiscStoreState, chatBotListFilter: IChatBotListFilter): void {
      state.chatBotListFilter = chatBotListFilter
    },
    RESET_STORE_STATE(state: IMiscStoreState): void {
      Object.assign(state, getDefaultState())
    },
    SOCKET_UPDATE_EMOJI_LIST(state: IMiscStoreState, emojiList: Array<IEmoji>): void {
      state.emojiList = emojiList
    },
    SOCKET_UPDATE_CHAT_BOT_LIST(state: IMiscStoreState, chatBotList: Array<IChatBot>): void {
      state.chatBotList = chatBotList
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
    },
    filteredChatBotList: (state: IMiscStoreState): Array<IChatBot> => {
      let regexFilter = state.chatBotListFilter.regex.trim().toLowerCase()

      return state.chatBotList
        .filter((chatBot: IChatBot) => {
          if (chatBot.regex.toLowerCase().includes(regexFilter)) {
            return chatBot
          }
        })
        .sort((a: IChatBot, b: IChatBot) => {
          if (a.userId > b.userId) {
            return 1
          }
          return -1
        })
    }
  }
}

export default misc
