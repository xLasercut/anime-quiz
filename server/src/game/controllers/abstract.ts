import {GameDataError} from '../../exceptions'
import {Server} from 'socket.io'
import {IRoom, ISocket} from '../../interfaces'
import {IRoomSerial} from '../../../../shared/interfaces/game'

class AbstractGameController {
  protected _rooms: {[key: string]: IRoom} = {}
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public getSocket(socketId: string): ISocket {
    //@ts-ignore
    return this._io.sockets.connected[socketId]
  }

  public getRoomId(socketId: string): string {
    for (let roomId in this._rooms) {
      if (this._rooms[roomId].players.has(socketId)) {
        return roomId
      }
    }
    return ''
  }

  public getRoomList(): Array<IRoomSerial> {
    let roomList = []
    for (let roomId in this._rooms) {
      roomList.push({
        name: this._rooms[roomId].name,
        roomId: roomId
      })
    }
    return roomList
  }

  public resetPlayerScore(roomId: string): void {
    this._validateRoomIdExists(roomId)
    for (let socketId of Array.from(this._rooms[roomId].players)) {
      this.getSocket(socketId).player.resetScore()
    }
  }

  public newRound(roomId: string): void {
    this._validateRoomIdExists(roomId)
    for (let socketId of Array.from(this._rooms[roomId].players)) {
      this.getSocket(socketId).player.reset()
    }
  }

  public getNextHostId(roomId: string): string {
    this._validateRoomIdExists(roomId)
    return Array.from(this._rooms[roomId].players)[0]
  }

  protected _validateRoomIdNotExists(roomId: string): void {
    if (roomId in this._rooms) {
      throw new GameDataError('Room ID already in use')
    }
  }

  protected _validateRoomIdExists(roomId: string): void {
    if (!(roomId in this._rooms)) {
      throw new GameDataError('Room ID does not exist')
    }
  }

  protected _isRoomEmpty(roomId: string): boolean {
    this._validateRoomIdExists(roomId)
    return this._rooms[roomId].players.size === 0
  }

  protected _deleteRoom(roomId: string): void {
    this._validateRoomIdExists(roomId)
    this._resetCountdown(roomId)
    this._resetTimeout(roomId)
    delete this._rooms[roomId]
  }

  protected _resetTimeout(roomId: string): void {
    clearTimeout(this._rooms[roomId].timeout)
  }

  protected _resetCountdown(roomId: string): void {
    clearInterval(this._rooms[roomId].countdown)
  }
}

export {AbstractGameController}
