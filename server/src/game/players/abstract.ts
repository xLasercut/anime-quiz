class AbstractPlayer {
  protected _username: string
  protected _avatar: string
  protected _admin: boolean
  protected _socketId: string
  public score = 0
  public host = false

  constructor(username: string, avatar: string, admin: boolean, socketId: string) {
    this._username = username
    this._avatar = avatar
    this._admin = admin
    this._socketId = socketId
  }

  public resetScore(): void {
    this.score = 0
  }
}

export {AbstractPlayer}
