<template>
  <v-col cols="12" align-self="center" :class="classes()">
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
import {defineComponent, onUnmounted, toRefs} from '@vue/composition-api'
import {socket} from '@/assets/socket'
import {countdownApi} from '@/assets/countdown'

export default defineComponent({
  setup(_props, context) {
    const {state, startCountdown, stopCountdown, countdownPercentage, countdownColor} = countdownApi()

    function classes(): string {
      let classes = ['countdown-container']

      if (!state.show) {
        classes.push('countdown-hidden')
      }

      return classes.join(' ')
    }

    socket.on('AMQ_START_COUNTDOWN', (): void => {
      startCountdown(context.root.$store.state.amq.settings.guessTime)
    })

    socket.on('AMQ_TIME_UP', (): void => {
      stopCountdown()
    })

    socket.on('AMQ_RESET', (): void => {
      stopCountdown()
    })

    onUnmounted(() => {
      socket.off('AMQ_START_COUNTDOWN')
      socket.off('AMQ_TIME_UP')
      socket.off('AMQ_RESET')
    })

    return {classes, ...toRefs(state), countdownColor, countdownPercentage}
  }
})
</script>

<style scoped>
.countdown-container {
  height: 100%;
  text-align: center;
}

.countdown-hidden {
  position: absolute;
  top: -200%;
}
</style>
