import {IRoom} from '../../interfaces'
import {v4 as uuid4} from 'uuid'
import {Server} from 'socket.io'

class AbstractGameRooms {
  protected _io: Server
  protected _type: string
  protected _roomIdFormat: RegExp

  constructor(io: Server, type: string) {
    this._io = io
    this._type = type
    this._roomIdFormat = new RegExp(`^${type}_$`, 'i')
  }

  public newRoom(roomId: string): void {

  }

  public getRoom(roomId: string): IRoom {
    //@ts-ignore
    return this._io.sockets.adapter.rooms[roomId]
  }

  public getRoomList(): Array<IRoom> {
    let roomList = []
    for (let roomId in this._io.sockets.adapter.rooms) {
      if (this._roomIdFormat.test(roomId)) {
        roomList.push(roomId)
      }
    }
    return roomList
  }

  public generateRoomId(): string {
    return `${this._type}_${uuid4()}`
  }
}

export {AbstractGameRooms}
