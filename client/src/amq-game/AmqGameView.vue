<template>
  <v-main>
    <v-row justify="center">
      <amq-game-window></amq-game-window>
      <game-chat-window></game-chat-window>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import GameChatWindow from '@/components/game/GameChatWindow.vue'
import AmqGameWindow from '@/amq-game/AmqGameWindow.vue'

export default defineComponent({
  components: {
    GameChatWindow, AmqGameWindow
  }
})
</script>
