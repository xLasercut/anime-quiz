<template>
  <v-row justify="center">
    <amq-game-window></amq-game-window>
    <game-chat-window></game-chat-window>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import AmqGameWindow from '@/game/amq/AmqGameWindow.vue'
  import GameChatWindow from '@/components/game/GameChatWindow.vue'

  export default defineComponent({
    components: {
      AmqGameWindow, GameChatWindow
    }
  })
</script>
