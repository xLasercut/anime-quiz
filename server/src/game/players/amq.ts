import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {IBannerColor} from '../../../../shared/types/game'

class AmqPlayer {
  protected _username: string
  protected _avatar: string
  protected _admin: boolean
  protected _socketId: string
  public score = 0
  public color: IBannerColor = 'error'
  public host = false
  public selector = false
  public guess = {
    title: '',
    anime: ''
  }
  public ready = {
    load: false,
    guess: false
  }

  constructor(username: string, avatar: string, admin: boolean, socketId: string) {
    this._username = username
    this._avatar = avatar
    this._admin = admin
    this._socketId = socketId
  }

  public resetScore(): void {
    this.score = 0
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

    this.selector = false
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
