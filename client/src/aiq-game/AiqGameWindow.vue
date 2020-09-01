<template>
  <v-col cols="7" sm="8" class="game-window">
    <game-main-answer-display
      :current-count="$store.state.aiq.gameState.currentImageCount"
      :max-count="$store.state.aiq.gameState.maxImageCount"
      :answer="answer"
      :show="show"
    ></game-main-answer-display>
    <aiq-viewport></aiq-viewport>
    <aiq-guess-input></aiq-guess-input>
    <aiq-player-list></aiq-player-list>
  </v-col>
</template>

<script lang="ts">
import {computed, defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import GameMainAnswerDisplay from '@/components/game/GameMainAnswerDisplay.vue'
import {socket} from '@/assets/socket'
import AiqGuessInput from '@/aiq-game/aiq-game-window/AiqGuessInput.vue'
import AiqPlayerList from '@/aiq-game/aiq-game-window/AiqPlayerList.vue'
import AiqViewport from '@/aiq-game/aiq-game-window/AiqViewport.vue'


export default defineComponent({
  components: {
    GameMainAnswerDisplay, AiqGuessInput, AiqPlayerList, AiqViewport
  },
  setup(_props, context) {
    const state = reactive({
      show: false
    })

    const answer = computed(() => {
      return `${context.root.$store.state.aiq.gameState.currentImage.anime[0]}\n${context.root.$store.state.aiq.gameState.currentImage.name}`
    })

    socket.on('AIQ_NEW_IMAGE', (): void => {
      state.show = false
    })

    socket.on('AMQ_TIME_UP', (): void => {
      state.show = true
    })

    onUnmounted(() => {
      socket.off('AIQ_NEW_IMAGE')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state), answer}
  }
})
</script>
