import {AbstractPlayer} from './abstract'
import {IBannerColor} from '../../../../shared/types/game'
import {IAiqGuess, IAiqPlayer} from '../../../../shared/interfaces/aiq'

class AiqPlayer extends AbstractPlayer {
  public color: IBannerColor = 'error'
  public guess: IAiqGuess = {
    name: '',
    anime: ''
  }
  public ready = {
    load: false,
    guess: false
  }

  constructor(username: string, avatar: string, admin: boolean, socketId: string) {
    super(username, avatar, admin, socketId)
  }

  public reset(): void {
    this.guess = {
      name: '',
      anime: ''
    }

    this.ready = {
      load: false,
      guess: false
    }

    this.color = 'error'
  }

  public serialize(): IAiqPlayer {
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

export {AiqPlayer}
