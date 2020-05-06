import * as socketio from 'socket.io'
import {IBannerColor} from '../../../shared/types/game'
import {IChoices, ISong} from '../../../shared/interfaces/database'

class Emitter {
  protected _io: socketio.Server

  constructor(io: socketio.Server) {
    this._io = io
  }

  public updateSongList(songList: Array<ISong>, sid: string = null): void {
    this._client(sid).emit('UPDATE_SONG_LIST', songList)
  }

  public updateUsers(users: Array<string>, sid: string = null): void {
    this._client(sid).emit('UPDATE_USERS', users)
  }

  public updateChoices(choices: IChoices, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_CHOICES', choices)
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
