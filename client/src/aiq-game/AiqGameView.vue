<template>
  <v-main>
    <v-row justify="center">
      <aiq-game-window></aiq-game-window>
      <game-chat-window></game-chat-window>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import GameChatWindow from '@/components/game/GameChatWindow.vue'
import AiqGameWindow from '@/aiq-game/AiqGameWindow.vue'


export default defineComponent({
  components: {
    GameChatWindow, AiqGameWindow
  }
})
</script>
