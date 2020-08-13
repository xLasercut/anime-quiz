<template>
  <v-col cols="5" sm="4" class="chat-window">
    <div class="message-container">
      <chat-message v-for="(message, index) in messages" :key="`chat_${index}`" :message="message"></chat-message>
    </div>
    <chat-input @chat="$emit('chat', $event)"></chat-input>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, watch} from '@vue/composition-api'
import {IChat} from '../../../../shared/interfaces/game'
import ChatMessage from '@/components/game/game-chat-window/ChatMessage.vue'
import ChatInput from '@/components/game/game-chat-window/ChatInput.vue'

interface IState {
  messages: Array<IChat>
}

export default defineComponent({
  props: {
    messages: {
      required: true
    }
  },
  components: {
    ChatMessage, ChatInput
  },
  setup(props, context) {

    watch(() => props.messages, (val) => {
      let element = document.querySelector('.message-container')
      if (element) {
        element.scrollTop = element.scrollHeight - element.clientHeight
      }
    })
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
