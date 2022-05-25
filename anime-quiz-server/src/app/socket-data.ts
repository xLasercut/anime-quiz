class SocketData {
  public auth: boolean
  public admin: boolean
  public username: string
  public avatar: string
  protected _id: string
  public clientAuthTimer: NodeJS.Timeout
  public host: boolean

  constructor(id: string) {
    this.auth = false
    this.admin = false
    this.host = false
    this._id = id
    this.username = ''
    this.avatar = ''
  }

  public userLogin(username: string, avatar: string): void {
    this.username = username
    this.avatar = avatar
  }
}

export {
  SocketData
}
