function calculateStartPosition(startPosition: number, guessTime: number, duration: number): number {
  const maxStart = Math.floor(duration - guessTime)
  if (maxStart > 0) {
    return Math.floor(startPosition * maxStart)
  }
  return 0
}

export {
  calculateStartPosition
}
