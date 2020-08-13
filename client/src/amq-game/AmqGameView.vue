<template>
  <v-main>
    <v-row justify="center">
      <amq-game-window></amq-game-window>
      <game-chat-window :messages="messages" @chat="sendMessage($event)"></game-chat-window>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import GameChatWindow from '@/components/game/GameChatWindow.vue'
import {socket} from '@/assets/socket'
import {IChat} from '../../../shared/interfaces/game'
import AmqGameWindow from '@/amq-game/AmqGameWindow.vue'

interface IState {
  messages: Array<IChat>
}

export default defineComponent({
  components: {
    GameChatWindow, AmqGameWindow
  },
  setup(_props, context) {
    const state = reactive<IState>({
      messages: []
    })

    function sendMessage(message: string): void {
      socket.emit('AMQ_GAME_CHAT', message)
    }

    socket.on('UPDATE_AMQ_CHAT', (message: IChat) => {
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
      socket.off('UPDATE_AMQ_CHAT')
    })

    return {...toRefs(state), sendMessage}
  }
})
</script>
