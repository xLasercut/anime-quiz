<template>
  <v-col cols="7" sm="8" class="game-window">
    <game-main-answer-display
      :current-count="$store.state.amq.gameState.currentSongCount"
      :max-count="$store.state.amq.gameState.maxSongCount"
      :answer="$store.state.amq.gameState.currentSong.anime[0]"
      :show="show"
    ></game-main-answer-display>
    <amq-viewport></amq-viewport>
    <amq-guess-input></amq-guess-input>
    <amq-player-list></amq-player-list>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import AmqPlayerList from '@/amq-game/amq-game-window/AmqPlayerList.vue'
import AmqGuessInput from '@/amq-game/amq-game-window/AmqGuessInput.vue'
import AmqViewport from '@/amq-game/amq-game-window/AmqViewport.vue'
import GameMainAnswerDisplay from '@/components/game/GameMainAnswerDisplay.vue'
import {socket} from '@/assets/socket'


export default defineComponent({
  components: {
    AmqPlayerList, AmqGuessInput, AmqViewport, GameMainAnswerDisplay
  },
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    socket.on('AMQ_NEW_SONG', (): void => {
      state.show = false
    })

    socket.on('AMQ_TIME_UP', (): void => {
      state.show = true
    })

    onUnmounted(() => {
      socket.off('AMQ_NEW_SONG')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state)}
  }
})
</script>
