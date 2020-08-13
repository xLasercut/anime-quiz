import {IBannerColor} from '../../../shared/types/game'

function countdownPercentage(time: number, maxTime: number): number {
  return 100 * (1 - time / maxTime)
}

function countdownColor(time: number, maxTime: number): IBannerColor {
  let percentage = countdownPercentage(time, maxTime)
  if (percentage > 75) {
    return 'error'
  }
  else if (percentage > 50) {
    return 'warning'
  }
  return 'success'
}

export {countdownPercentage, countdownColor}
