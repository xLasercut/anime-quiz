<template>
  <v-col cols="12" sm="3" align-self="center" :class="classes()">
    <v-progress-circular
      :rotate="270"
      :size="100"
      :width="15"
      :value="countdownPercentage()"
      :color="countdownColor()"
    >
      {{ time }}
    </v-progress-circular>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import {socket} from '@/assets/socket'
import {countdownApi} from '@/assets/countdown'

export default defineComponent({
  setup(_props, context) {
    const {state, startCountdown, stopCountdown, countdownPercentage, countdownColor} = countdownApi()

    socket.on('AIQ_START_COUNTDOWN', (): void => {
      startCountdown(context.root.$store.state.aiq.settings.guessTime)
    })

    socket.on('AIQ_TIME_UP', (): void => {
      stopCountdown()
    })

    socket.on('AIQ_RESET', (): void => {
      stopCountdown()
    })

    onUnmounted(() => {
      socket.off('AIQ_START_COUNTDOWN')
      socket.off('AIQ_TIME_UP')
      socket.off('AIQ_RESET')
    })

    function classes(): string {
      let classes = ['countdown-container']

      if (!state.show) {
        classes.push('countdown-hidden')
      }

      return classes.join(' ')
    }

    return {...toRefs(state), countdownColor, countdownPercentage, classes}
  }
})
</script>

<style scoped>
.countdown-container {
  height: 100%;
  text-align: center;
  max-width: 150px;
}

.countdown-hidden {
  position: absolute;
  top: -200%;
}
</style>
