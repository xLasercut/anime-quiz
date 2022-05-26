<template>
  <v-col cols="7" sm="8">
    <v-card flat :height="CLIENT_CONSTANTS.PAGE_HEIGHT">
      <game-video-window></game-video-window>
      <v-divider></v-divider>
      <game-guess-input></game-guess-input>
      <v-divider></v-divider>
      <game-players></game-players>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import GamePlayers from './game-main-view/GamePlayers.vue'
import GameGuessInput from './game-main-view/GameGuessInput.vue'
import GameVideoWindow from './game-main-view/GameVideoWindow.vue'

export default defineComponent({
  components: { GameGuessInput, GamePlayers, GameVideoWindow },
  setup() {
    return {
      CLIENT_CONSTANTS
    }
  }
})
</script>
