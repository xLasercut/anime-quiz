import {IChatBotListFilter, IChatBotStoreState, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IChatBot} from '../../../shared/interfaces/database'

function _getDefaultState(): IChatBotStoreState {
  return {
    chatBotList: [],
    chatBotListFilter: {
      regex: ''
    }
  }
}

const chatBot: Module<IChatBotStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    RESET_STORE_STATE(state: IChatBotStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_CHAT_BOT_LIST_FILTER(state: IChatBotStoreState, chatBotListFilter: IChatBotListFilter): void {
      state.chatBotListFilter = chatBotListFilter
    },
    SOCKET_UPDATE_CHAT_BOT_LIST(state: IChatBotStoreState, chatBotList: Array<IChatBot>): void {
      state.chatBotList = chatBotList
    }
  },
  getters: {
    filteredChatBotList: (state: IChatBotStoreState): Array<IChatBot> => {
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

export default chatBot
