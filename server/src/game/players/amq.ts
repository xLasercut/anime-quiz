import {Server} from 'socket.io'
import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {ISocket} from '../../interfaces'
import {IBannerColor} from '../../../../shared/types/game'

class AmqPlayerManager {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public getPlayerList(roomId: string): Array<IAmqPlayer> {
    return Object.values(this._io.sockets.sockets).map((socket: ISocket) => {
      if (socket.roomId === roomId) {
        return socket.player.serialize()
      }
    })
  }
}


class AmqPlayer {
  protected _username: string
  protected _avatar: string
  public score = 0
  public admin = false
  public color: IBannerColor = 'error'
  public host = false
  public guess = {
    title: '',
    anime: ''
  }

  constructor(username: string, avatar: string) {
    this._username = username
    this._avatar = avatar
  }

  public serialize(): IAmqPlayer {
    return {
      username: this._username,
      avatar: this._avatar,
      score: this.score,
      admin: this.admin,
      host: this.host,
      color: this.color,
      guess: this.guess
    }
  }
}


export {AmqPlayer, AmqPlayerManager}
