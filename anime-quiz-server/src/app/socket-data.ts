class SocketData {
  public auth: boolean
  public admin: boolean
  protected _username: string
  protected _id: string
  public clientAuthTimer: NodeJS.Timeout

  constructor(id: string) {
    this.auth = false
    this.admin = false
    this._id = id
  }

  public userLogin(username: string): void {
    this._username = username
  }
}

export {
  SocketData
}
