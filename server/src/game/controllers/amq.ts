import {IAmqRoom, ISocket} from '../../interfaces'
import {AbstractGameController} from './abstract'
import {v4 as uuid4} from 'uuid'
import {AmqSettings} from '../settings/amq'
import {AmqGameState} from '../state/amq'
import {Server} from 'socket.io'
import {IAmqPlayer} from '../../../../shared/interfaces/amq'
import {IAmqReadyType} from '../../../../shared/types/amq'

class AmqGameController extends AbstractGameController {
  protected _rooms: { [key: string]: IAmqRoom } = {}

  constructor(io: Server) {
    super(io)
  }

  public newRoom(socket: ISocket, roomName: string): void {
    let roomId = uuid4()
    this._validateRoomIdNotExists(roomId)
    this._rooms[roomId] = {
      name: roomName,
      settings: new AmqSettings(),
      state: new AmqGameState(),
      players: new Set([socket.id]),
      countdown: null,
      timeout: null
    }
    socket.join(roomId)
  }

  public getRoom(roomId: string): IAmqRoom {
    return this._getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAmqPlayer> {
    return this._getPlayerList(roomId)
  }

  public resetTimer(roomId: string): void {
    this._validateRoomIdExists(roomId)
    this._resetTimeout(roomId)
    this._resetCountdown(roomId)
  }

  public async startCountdown(roomId: string, maxTime: number, readyType: IAmqReadyType): Promise<any> {
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

  public async startTimeout(roomId: string, time: number): Promise<any> {
    this._validateRoomIdExists(roomId)
    this._resetTimeout(roomId)
    return new Promise((resolve, reject) => {
      this._rooms[roomId].timeout = setTimeout(() => {
        this._resetTimeout(roomId)
        resolve(true)
      }, time)
    })
  }

  protected _allPlayerReady(roomId: string, readyType: IAmqReadyType): boolean {
    this._validateRoomIdExists(roomId)
    for (let socketId of Array.from(this._rooms[roomId].players)) {
      if (!this.getSocket(socketId).player.ready[readyType]) {
        return false
      }
    }
    return true
  }
}

export {AmqGameController}
