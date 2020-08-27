import {AbstractPlayer} from './abstract'
import {IBannerColor} from '../../../../shared/types/game'
import {IAwqGuess, IAwqPlayer} from '../../../../shared/interfaces/awq'

class AwqPlayer extends AbstractPlayer {
  public color: IBannerColor = 'error'
  public guess: IAwqGuess = {
    weapon: '',
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
      weapon: '',
      anime: ''
    }

    this.ready = {
      load: false,
      guess: false
    }

    this.color = 'error'
  }

  public serialize(): IAwqPlayer {
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

export {AwqPlayer}
