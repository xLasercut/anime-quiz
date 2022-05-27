import { AqClientData, AqGameGuess, AqGamePlayer } from '../shared/interfaces'

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

  constructor(id: string) {
    this.auth = false
    this.admin = false
    this.host = false
    this._id = id
    this.username = ''
    this.avatar = ''
    this.score = 0
    this.gameGuess = {
      anime: '',
      title: ''
    }
    this.songLoaded = false
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
      score: this.score
    }
  }

  public newRound(): void {
    this.songLoaded = false
    this.gameGuess = {
      anime: '',
      title: ''
    }
  }
}

export {
  SocketData
}
