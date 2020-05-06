import * as socketio from 'socket.io'
import {IBannerColor} from '../../../shared/types/game'

class Emitter {
  protected _io: socketio.Server

  constructor(io: socketio.Server) {
    this._io = io
  }

  public systemNotification(color: IBannerColor, message: string, sid: string = null): void {
    this._client(sid).emit('SYSTEM_NOTIFICATION', color, message)
  }

  protected _client(sid: string = null): socketio.Namespace | socketio.Server {
    if (sid) {
      return this._io.to(sid)
    }
    return this._io
  }
}

export {Emitter}
