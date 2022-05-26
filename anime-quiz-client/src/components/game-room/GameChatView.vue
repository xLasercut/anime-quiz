<template>
  <v-col cols="5" sm="4">
    <v-card flat :height="CLIENT_CONSTANTS.PAGE_HEIGHT">
      <v-card-text>
        <div class="chat-message-container">
          <chat-message
            v-for="(message, index) in messages"
            :message="message"
            :key="`chat-message-${index}`"
          ></chat-message>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <chat-input></chat-input>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import ChatInput from './game-chat-view/ChatInput.vue'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import { AqGameChatMessage } from '../../assets/shared/interfaces'
import ChatMessage from './game-chat-view/ChatMessage.vue'

interface State {
  messages: AqGameChatMessage[]
}

export default defineComponent({
  components: { ChatMessage, ChatInput },
  setup() {
    const state = reactive<State>({
      messages: []
    })

    socket.on(SHARED_EVENTS.UPDATE_GAME_CHAT, (message: AqGameChatMessage) => {
      if (state.messages.length > 100) {
        state.messages.splice(0, 1)
      }

      if (state.messages.length > 0) {
        if (message.sid === state.messages[state.messages.length - 1].sid) {
          message.repeat = true
        }
      }

      state.messages.push(message)
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.UPDATE_GAME_CHAT)
    })

    return {
      CLIENT_CONSTANTS,
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
.chat-message-container {
  height: calc(100vh - 272px);
  overflow: auto;
  word-wrap: break-word;
}
</style>
