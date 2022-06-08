import { Server } from '../app/server'

class AbstractEmitter {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  protected _client(sid: string) {
    if (sid) {
      return this._io.to(sid).compress(true)
    }
    return this._io.compress(true)
  }
}

export {
  AbstractEmitter
}
