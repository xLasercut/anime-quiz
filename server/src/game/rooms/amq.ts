import {Server} from 'socket.io'
import {MasterRoomManager} from './master'
import {IRoomType} from '../../../../shared/types/game'
import {IAmqRoom, ISocket} from '../../interfaces'
import {v4 as uuid4} from 'uuid'
import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {AmqSettings} from '../settings/amq'

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
  }

  public getRoom(roomId: string): IAmqRoom {
    return super.getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAmqPlayer> {
    return super.getPlayerList(roomId)
  }

  public isAmqRoom(roomId: string): boolean {
    return this.getRoom(roomId).type === this._type
  }
}

export {AmqRoomManager}
