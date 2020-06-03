<template>
  <v-col cols="5" sm="4" class="chat-window">
    <div class="message-container">
      <chat-message v-for="(message, index) in messages" :key="`chat_${index}`" :message="message"></chat-message>
    </div>
    <chat-input></chat-input>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import {IChat} from '../../../../shared/interfaces/game'
  import {socket} from '@/assets/socket'
  import ChatMessage from '@/components/game/game-chat-window/ChatMessage.vue'
  import ChatInput from '@/components/game/game-chat-window/ChatInput.vue'

  interface IState {
    messages: Array<IChat>
  }

  export default defineComponent({
    components: {
      ChatMessage, ChatInput
    },
    setup(_props, context) {
      const state = reactive<IState>({
        messages: []
      })

      function scrollChat(): void {
        let element = document.querySelector('.message-container')
        if (element) {
          element.scrollTop = element.scrollHeight - element.clientHeight
        }
      }

      onMounted(() => {
        socket.on('UPDATE_CHAT_MESSAGE', (message: IChat) => {
          if (state.messages.length > 100) {
            state.messages.splice(0, 1)
          }

          if (state.messages.length > 0) {
            if (message.userId === state.messages[state.messages.length - 1].userId) {
              message.repeat = true
            }
          }

          state.messages.push(message)
          context.root.$nextTick(() => {
            scrollChat()
          })
        })
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
