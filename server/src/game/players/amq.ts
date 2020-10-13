import {IAmqGuess, IAmqPlayer} from '../../../../shared/interfaces/amq'
import {IBannerColor} from '../../../../shared/types/game'
import {AbstractPlayer} from './abstract'

class AmqPlayer extends AbstractPlayer {
  public color: IBannerColor = 'error'
  public guess: IAmqGuess = {
    title: '',
    anime: ''
  }
  public ready = {
    load: false,
    guess: false
  }
  public guessTime: Date = null

  constructor(username: string, avatar: string, admin: boolean, socketId: string) {
    super(username, avatar, admin, socketId)
  }

  public reset(): void {
    this.guess = {
      title: '',
      anime: ''
    }

    this.ready = {
      load: false,
      guess: false
    }

    this.color = 'error'

    this.guessTime = new Date()
  }

  public serialize(): IAmqPlayer {
    return {
      username: this._username,
      avatar: this._avatar,
      score: this.score,
      admin: this._admin,
      host: this.host,
      color: this.color,
      guess: this.guess,
      socketId: this._socketId
    }
  }
}


export {AmqPlayer}
