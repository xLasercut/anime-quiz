<template>
  <v-main>
    <v-row justify="center">
      <awq-game-window></awq-game-window>
      <game-chat-window></game-chat-window>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import GameChatWindow from '@/components/game/GameChatWindow.vue'
import AwqGameWindow from '@/awq-game/AwqGameWindow.vue'


export default defineComponent({
  components: {
    GameChatWindow, AwqGameWindow
  }
})
</script>
