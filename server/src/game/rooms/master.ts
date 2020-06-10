import {Server} from 'socket.io'
import {IRoomSerial} from '../../../../shared/interfaces/game'
import {IRoom, ISocket} from '../../interfaces'
import {GameDataError} from '../../exceptions'
import {IAmqPlayer} from '../../../../shared/interfaces/amq'

class MasterRoomManager {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public getRoomList(): Array<IRoomSerial> {
    return Object.values(this._io.sockets.adapter.rooms)
      .filter((room: IRoom): IRoom => {
        if (room.roomId) {
          return room
        }
      })
      .map((room: IRoom): IRoomSerial => {
        return {
          name: room.name,
          type: room.type,
          roomId: room.roomId
        }
      })
  }

  public getRoom(roomId: string): any {
    return this._io.sockets.adapter.rooms[roomId] || {}
  }

  public getPlayerList(roomId: string): Array<any> {
    this._validateRoomIdExists(roomId)
    let players = this.getRoom(roomId).sockets

    return Object.values(this._io.sockets.connected)
      .filter((socket: ISocket): ISocket => {
        if (socket.id in players) {
          return socket
        }
      })
      .map((socket: ISocket): IAmqPlayer => {
        return socket.player.serialize()
      })
  }

  protected _validateRoomIdNotExists(roomId: string): void {
    if (roomId in this._io.sockets.adapter.rooms) {
      throw new GameDataError('Room ID already in use')
    }
  }

  protected _validateRoomIdExists(roomId: string): void {
    if (!(roomId in this._io.sockets.adapter.rooms)) {
      throw new GameDataError('Room ID does not exist')
    }
  }
}

export {MasterRoomManager}