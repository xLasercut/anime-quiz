import { LOCAL_STORAGE_CONSTANTS } from './constants'

function calculateStartPosition(startPosition: number, guessTime: number, duration: number): number {
  const maxStart = Math.floor(duration - guessTime)
  if (maxStart > 0) {
    return Math.floor(startPosition * maxStart)
  }
  return 0
}

function getDefaultVolume(): number {
  try {
    return parseInt(localStorage[LOCAL_STORAGE_CONSTANTS.AQ_VOLUME])
  } catch {
    return 50
  }

}

export {
  calculateStartPosition,
  getDefaultVolume
}
