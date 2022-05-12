class SocketData {
  public auth: boolean
  public admin: boolean
  public username: string
  protected _id: string
  public clientAuthTimer: NodeJS.Timeout

  constructor(id: string) {
    this.auth = false
    this.admin = false
    this._id = id
  }

  public userLogin(username: string): void {
    this.username = username
  }
}

export {
  SocketData
}
