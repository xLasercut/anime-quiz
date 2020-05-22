import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {IBannerColor} from '../../../../shared/types/game'

class AmqPlayer {
  protected _username: string
  protected _avatar: string
  public score = 0
  public admin = false
  public color: IBannerColor = 'error'
  public host = false
  public guess = {
    title: '',
    anime: ''
  }

  constructor(username: string, avatar: string) {
    this._username = username
    this._avatar = avatar
  }

  public serialize(): IAmqPlayer {
    return {
      username: this._username,
      avatar: this._avatar,
      score: this.score,
      admin: this.admin,
      host: this.host,
      color: this.color,
      guess: this.guess
    }
  }
}


export {AmqPlayer}
