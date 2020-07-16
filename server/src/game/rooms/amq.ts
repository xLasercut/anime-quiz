import {Server} from 'socket.io'
import {MasterRoomManager} from './master'
import {IRoomType} from '../../../../shared/types/game'
import {IAmqRoom, ISocket} from '../../interfaces'
import {v4 as uuid4} from 'uuid'
import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {AmqSettings} from '../settings/amq'
import {AmqGameState} from '../state/amq'
import {IAmqReadyType} from '../../../../shared/types/amq'
import {AmqPlayer} from '../players/amq'

class AmqRoomManager extends MasterRoomManager {
  protected _type: IRoomType = 'amq'

  constructor(io: Server) {
    super(io)
  }

  public newRoom(socket: ISocket, roomName: string): void {
    let roomId = uuid4()
    this._validateRoomIdNotExists(roomId)
    socket.roomId = roomId
    socket.join(roomId)
    this.getRoom(roomId).name = roomName
    this.getRoom(roomId).type = this._type
    this.getRoom(roomId).roomId = roomId
    this.getRoom(roomId).settings = new AmqSettings()
    this.getRoom(roomId).state = new AmqGameState()
  }

  public getRoom(roomId: string): IAmqRoom {
    return super.getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAmqPlayer> {
    return super.getPlayerList(roomId)
  }

  public allPlayerReady(roomId: string, readyType: IAmqReadyType): boolean {
    if (this._isRoomExists(roomId)) {
      let players = this.getRoom(roomId).sockets
      for (let socketId in this._io.sockets.connected) {
        if (socketId in players) {
          if (!this._getPlayer(socketId).ready[readyType]) {
            return false
          }
        }
      }
    }
    return true
  }

  public singlePlayerReady(socketId: string, readyType: IAmqReadyType): boolean {
    return this._getPlayer(socketId).ready[readyType]
  }

  public roundOver(roomId: string): void {
    if (this._isRoomExists(roomId)) {

    }
  }

  public isAmqRoom(roomId: string): boolean {
    return (this._isRoomExists(roomId) && (this.getRoom(roomId).type === this._type))
  }

  protected _getPlayer(socketId: string): AmqPlayer {
    return this._getSocket(socketId).player
  }
}

export {AmqRoomManager}
