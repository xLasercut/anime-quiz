import {AbstractGameController} from './abstract'
import {IAwqRoom, ISocket} from '../../interfaces'
import {Server} from 'socket.io'
import {v4 as uuid4} from 'uuid'
import {AiqSettings} from '../settings/aiq'
import {AiqGameState} from '../state/aiq'
import {IAiqPlayer} from '../../../../shared/interfaces/aiq'
import {IAiqReadyType} from '../../../../shared/types/aiq'

class AiqGameController extends AbstractGameController {
  protected _rooms: { [key: string]: IAwqRoom }

  constructor(io: Server) {
    super(io)
  }

  public newRoom(socket: ISocket, roomName: string): void {
    let roomId = uuid4()
    this._validateRoomIdNotExists(roomId)
    this._rooms[roomId] = {
      name: roomName,
      settings: new AiqSettings(),
      state: new AiqGameState(),
      players: new Set([socket.id]),
      countdown: null,
      timeout: null
    }
    socket.join(roomId)
  }

  public getRoom(roomId: string): IAwqRoom {
    return this._getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAiqPlayer> {
    return this._getPlayerList(roomId)
  }

  public async startCountdown(roomId: string, maxTime: number, readyType: IAiqReadyType): Promise<any> {
    this._validateRoomIdExists(roomId)
    this._resetCountdown(roomId)
    let time = 0
    return new Promise((resolve, reject) => {
      this._rooms[roomId].countdown = setInterval(() => {
        time += 500
        if (time >= maxTime) {
          this._resetCountdown(roomId)
          resolve(true)
        }
        else if (this._allPlayerReady(roomId, readyType)) {
          this._resetCountdown(roomId)
          resolve(true)
        }
      }, 500)
    })
  }

  protected _allPlayerReady(roomId: string, readyType: IAiqReadyType): boolean {
    this._validateRoomIdExists(roomId)
    for (let socketId of Array.from(this._rooms[roomId].players)) {
      if (!this.getSocket(socketId).player.ready[readyType]) {
        return false
      }
    }
    return true
  }
}


export {AiqGameController}
