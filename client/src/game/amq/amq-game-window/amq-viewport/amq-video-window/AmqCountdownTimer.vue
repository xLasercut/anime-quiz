<template>
  <v-col cols="12" align-self="center" :class="classes()">
    <v-progress-circular
      :rotate="270"
      :size="100"
      :width="15"
      :value="percentage()"
      :color="countdownColor()"
    >
      {{time}}
    </v-progress-circular>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    setup(_props, context) {
      const state = reactive({
        time: 0,
        show: false,
        maxTime: 0
      })

      let countdown: any = null

      function percentage(): number {
        return 100 * (1 - state.time / state.maxTime)
      }

      function countdownColor(): string {
        let countdownPercentage = percentage()
        if (countdownPercentage > 75) {
          return 'error'
        }
        else if (countdownPercentage > 50) {
          return 'warning'
        }
        return 'success'
      }

      function classes(): string {
        let classes = ['countdown-container']

        if (!state.show) {
          classes.push('countdown-hidden')
        }

        return classes.join(' ')
      }

      function startCountdown(): void {
        state.show = true
        state.time = context.root.$store.state.amq.settings.guessTime
        state.maxTime = context.root.$store.state.amq.settings.guessTime
        countdown = setInterval(() => {
          state.time -= 1
          if (state.time <= 0) {
            stopCountdown()
          }
        }, 1000)
      }

      function stopCountdown(): void {
        state.show = false
        clearInterval(countdown)
      }

      onMounted(() => {
        socket.on('AMQ_START_COUNTDOWN', (): void => {
          startCountdown()
        })

        socket.on('AMQ_TIME_UP', (): void => {
          stopCountdown()
        })

        socket.on('AMQ_RESET', (): void  => {
          stopCountdown()
        })
      })

      return {percentage, countdownColor, classes, ...toRefs(state)}
    }
  })
</script>

<style scoped>
  .countdown-container {
    height: 100%;
  }

  .countdown-hidden {
    position: absolute;
    top: -200%;
  }
</style>
