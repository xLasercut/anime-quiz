import {IAmqRoom, IPlayerTimedGuess, ISocket} from '../../interfaces'
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

  public newRound(roomId: string): void {
    this._validateRoomIdExists(roomId)
    for (let socketId of Array.from(this._rooms[roomId].players)) {
      this.getSocket(socketId).player.reset()
    }

    this._rooms[roomId].state.titleScoreMultiplier = 5
    this._rooms[roomId].state.animeScoreMultiplier = 5
  }

  public getRoom(roomId: string): IAmqRoom {
    return this._getRoom(roomId)
  }

  public getPlayerList(roomId: string): Array<IAmqPlayer> {
    return this._getPlayerList(roomId)
  }

  public getPlayerTimedGuessList(roomId: string): Array<IPlayerTimedGuess> {
    this._validateRoomIdExists(roomId)
    let players = this._getRoom(roomId).players
    return Object.values(this._io.sockets.connected)
      .filter((socket: ISocket): ISocket => {
        if (players.has(socket.id)) {
          return socket
        }
      })
      .map((socket: ISocket): IPlayerTimedGuess => {
        return {
          guess: socket.player.guess,
          guessTime: socket.player.guessTime,
          socketId: socket.id
        }
      })
      .sort((a:IPlayerTimedGuess, b: IPlayerTimedGuess) => {
        if (a.guessTime < b.guessTime) {
          return -1
        }
        return 1
      })
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
