<template>
  <v-main>
    <v-row dense>
      <game-main-view></game-main-view>
      <game-chat-view></game-chat-view>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import GameMainView from '../components/game-room/GameMainView.vue'
import GameChatView from '../components/game-room/GameChatView.vue'

export default defineComponent({
  components: { GameChatView, GameMainView }
})
</script>
