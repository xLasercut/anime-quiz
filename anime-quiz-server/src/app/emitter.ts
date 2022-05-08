import {Server} from 'socket.io'
import {SHARED_EVENTS} from '../shared/events'

class Emitter {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public systemNotification(color: string, message: string, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.SYSTEM_NOTIFICATION, color, message)
  }

  protected _client(sid: string) {
    if (sid) {
      return this._io.to(sid)
    }
    return this._io
  }
}

export {
  Emitter
}
