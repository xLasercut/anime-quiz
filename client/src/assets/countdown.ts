import {IBannerColor} from '../../../shared/types/game'
import {reactive} from '@vue/composition-api'

function countdownApi() {
  const state = reactive({
    time: 0,
    show: false,
    maxTime: 0
  })

  let countdown: any = null

  function startCountdown(time: number): void {
    state.show = true
    state.time = time
    state.maxTime = time
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

  function countdownPercentage(): number {
    return 100 * (1 - state.time / state.maxTime)
  }

  function countdownColor(): IBannerColor {
    let percentage = countdownPercentage()
    if (percentage > 75) {
      return 'error'
    }
    else if (percentage > 50) {
      return 'warning'
    }
    return 'success'
  }

  return {state, startCountdown, stopCountdown, countdownPercentage, countdownColor}
}

export {countdownApi}
