<template>
  <v-col cols="5" sm="4" class="chat-window">
    <div class="message-container">
      <chat-message v-for="(message, index) in messages" :key="`chat_${index}`" :message="message"></chat-message>
    </div>
    <chat-input></chat-input>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs, watch} from '@vue/composition-api'
import {IChat} from '../../../../shared/interfaces/game'
import ChatMessage from '@/components/game/game-chat-window/ChatMessage.vue'
import ChatInput from '@/components/game/game-chat-window/ChatInput.vue'
import {socket} from '@/assets/socket'

interface IState {
  messages: Array<IChat>
}

export default defineComponent({
  components: {
    ChatMessage, ChatInput
  },
  setup(props, _context) {
    const state = reactive<IState>({
      messages: []
    })

    watch(() => state.messages, (val) => {
      let element = document.querySelector('.message-container')
      if (element) {
        element.scrollTop = element.scrollHeight - element.clientHeight
      }
    })

    socket.on('UPDATE_GAME_CHAT', (message: IChat) => {
      if (state.messages.length > 100) {
        state.messages.splice(0, 1)
      }

      if (state.messages.length > 0) {
        if (message.userId === state.messages[state.messages.length - 1].userId) {
          message.repeat = true
        }
      }

      state.messages.push(message)
    })

    onUnmounted(() => {
      socket.off('UPDATE_GAME_CHAT')
    })

    return {...toRefs(state)}
  }
})
</script>

<style scoped>
.message-container {
  width: 100%;
  height: calc(100% - 140px);
  overflow: auto;
  word-wrap: break-word;
  padding: 5px;
}
</style>
