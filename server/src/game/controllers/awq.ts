import {AbstractGameController} from './abstract'
import {IAwqRoom, ISocket} from '../../interfaces'
import {Server} from 'socket.io'
import {v4 as uuid4} from 'uuid'
import {AwqSettings} from '../settings/awq'
import {AwqGameState} from '../state/awq'
import {IAwqPlayer} from '../../../../shared/interfaces/awq'

class AwqGameController extends AbstractGameController {
  protected _rooms: { [key: string]: IAwqRoom }

  constructor(io: Server) {
    super(io)
  }

  public newRoom(socket: ISocket, roomName: string): void {
    let roomId = uuid4()
    this._validateRoomIdNotExists(roomId)
    this._rooms[roomId] = {
      name: roomName,
      settings: new AwqSettings(),
      state: new AwqGameState(),
      players: new Set([socket.id]),
      countdown: null,
      timeout: null
    }
    socket.join(roomId)
  }

  public getRoom(roomId: string): IAwqRoom {
    return this._getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAwqPlayer> {
    return this._getPlayerList(roomId)
  }

}


export {AwqGameController}
