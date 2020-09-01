import Vue from 'vue'
import Vuex from 'vuex'
import client from '@/store/client'
import amq from '@/store/amq'
import emoji from '@/store/emoji'
import chatBot from '@/store/chat-bot'
import aiq from '@/store/aiq'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    client: client,
    amq: amq,
    emoji: emoji,
    chatBot: chatBot,
    aiq: aiq
  }
})
