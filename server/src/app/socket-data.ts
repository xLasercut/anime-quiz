import { AqClientData, AqGameGuess, AqGamePlayer } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'

class SocketData {
  public auth: boolean
  public admin: boolean
  public username: string
  public avatar: string
  protected _id: string
  public clientAuthTimer: NodeJS.Timeout
  public host: boolean
  public score: number
  public gameGuess: AqGameGuess
  public songLoaded: boolean
  public pendingScore: number
  public scoreColor: string

  constructor(id: string) {
    this.auth = false
    this.admin = false
    this.host = false
    this._id = id
    this.username = ''
    this.avatar = ''
    this.score = 0
    this.scoreColor = NOTIFICATION_COLOR.ERROR
    this.gameGuess = {
      anime: '',
      title: ''
    }
    this.songLoaded = false
    this.pendingScore = 0
  }

  public userLogin(username: string, avatar: string): void {
    this.username = username
    this.avatar = avatar
  }

  public getClientData(): AqClientData {
    return {
      username: this.username,
      avatar: this.avatar,
      admin: this.admin,
      host: this.host
    }
  }

  public getPlayerData(): AqGamePlayer {
    return {
      username: this.username,
      avatar: this.avatar,
      admin: this.admin,
      host: this.host,
      score: this.score,
      guess: this.gameGuess,
      scoreColor: this.scoreColor,
      sid: this._id
    }
  }

  public newRound(): void {
    this.songLoaded = false
    this.gameGuess = {
      anime: '',
      title: ''
    }
    this.pendingScore = 0
    this.scoreColor = NOTIFICATION_COLOR.ERROR
  }

  public updateScore(): void {
    this.score += this.pendingScore
    this.scoreColor = this._getScoreColor()
  }

  protected _getScoreColor(): string {
    if (this.pendingScore >= 2) {
      return NOTIFICATION_COLOR.SUCCESS
    }

    if (this.pendingScore >= 1) {
      return NOTIFICATION_COLOR.WARNING
    }

    return NOTIFICATION_COLOR.ERROR
  }
}

export { SocketData }
