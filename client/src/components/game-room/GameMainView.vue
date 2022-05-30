<template>
  <v-col cols="7" sm="8">
    <v-card flat :height="CLIENT_CONSTANTS.PAGE_HEIGHT" class="game-main-view" color="background">
      <v-card-text>
        <game-main-answer-display></game-main-answer-display>
        <game-viewport></game-viewport>
        <game-guess-input></game-guess-input>
        <game-players></game-players>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import GamePlayers from './game-main-view/GamePlayers.vue'
import GameGuessInput from './game-main-view/GameGuessInput.vue'
import GameViewport from './game-main-view/GameViewport.vue'
import GameMainAnswerDisplay from './game-main-view/GameMainAnswerDisplay.vue'

export default defineComponent({
  components: { GameMainAnswerDisplay, GameGuessInput, GamePlayers, GameViewport },
  setup() {
    return {
      CLIENT_CONSTANTS
    }
  }
})
</script>

<style scoped>
.game-main-view {
  overflow: auto;
  word-wrap: break-word;
}
</style>
