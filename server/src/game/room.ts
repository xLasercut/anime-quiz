import {IRoom} from '../../../shared/interfaces/game'
import {IRoomType} from '../../../shared/types/game'
import {v4 as uuid4} from 'uuid'
import {GameDataError} from '../exceptions'

class GameRooms {
  protected _rooms: { [key: string]: IRoom }

  constructor() {
    this._rooms = {}
  }

  public newRoom(roomName: string, roomType: IRoomType): string {
    let roomId = uuid4()
    this._rooms[roomId] = {
      name: roomName,
      type: roomType,
      roomId: roomId
    }
    return roomId
  }

  public deleteRoom(roomId: string): void {
    this.validateRoomIdExists(roomId)
    delete this._rooms[roomId]
  }

  public getRoomList(): Array<IRoom> {
    return Object.values(this._rooms)
  }

  public validateRoomIdNotExists(roomId: string): void {
    if (roomId in this._rooms) {
      throw new GameDataError('Room ID already in use')
    }
  }

  public validateRoomIdExists(roomId: string): void {
    if (!(roomId in this._rooms)) {
      throw new GameDataError('Room ID does not exist')
    }
  }
}

export {GameRooms}
