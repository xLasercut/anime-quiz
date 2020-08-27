class AbstractGameState {
  protected _getRandomIndex(list: Array<any>): number {
    return Math.floor(Math.random() * list.length)
  }
}

export {AbstractGameState}
