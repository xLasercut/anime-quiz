<template>
  <v-col cols="7" sm="8" class="game-window">
    <game-main-answer-display
      :current-count="$store.state.awq.gameState.currentWeaponCount"
      :max-count="$store.state.awq.gameState.maxWeaponCount"
      :answer="$store.state.awq.gameState.currentWeapon.anime[0]"
      :show="show"
    ></game-main-answer-display>
    <awq-guess-input></awq-guess-input>
    <awq-player-list></awq-player-list>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import GameMainAnswerDisplay from '@/components/game/GameMainAnswerDisplay.vue'
import AwqGuessInput from '@/awq-game/awq-game-window/AwqGuessInput.vue'
import AwqPlayerList from '@/awq-game/awq-game-window/AwqPlayerList.vue'

export default defineComponent({
  components: {
    GameMainAnswerDisplay, AwqGuessInput, AwqPlayerList
  },
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    return {...toRefs(state)}
  }
})
</script>
