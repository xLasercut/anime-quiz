import { Server } from 'socket.io'
import { AqGameRooms } from '../interfaces'
import { ROOM_NAME_PREFIX } from '../constants'
import { ROOM_NAME_FORMAT } from '../shared/constants'
import { GameDataValidationError } from '../app/exceptions'
import { Logger } from '../app/logging/logger'

class GameController {
  protected _rooms: AqGameRooms
  protected _io: Server
  protected _logger: Logger

  constructor(logger: Logger, io: Server) {
    this._logger = logger
    this._io = io
    this._rooms = {}
  }

  public getRoomList(): string[] {
    const roomList = []
    for (const room of this._io.sockets.adapter.rooms) {
      roomList.push(room[0])
    }
    return roomList.filter((roomName) => {
      return roomName.includes(ROOM_NAME_PREFIX)
    }).map((roomName) => {
      return roomName.replace(`${ROOM_NAME_PREFIX}|`, '')
    })
  }

  public validateNewRoomName(roomName: string): void {
    if (!ROOM_NAME_FORMAT.test(roomName)) {
      throw new GameDataValidationError('Invalid room name')
    }
  }

  public validateExistingRoomName(roomName: string): void {
    const roomList = this.getRoomList()
    if (!roomList.includes(roomName)) {
      throw new GameDataValidationError('Room does not exist')
    }
  }

  public syncRoomStates(): void {
    const roomList = this.getRoomList()
    this._createNewRoomsIfNotExists(roomList)
    this._removeOldRoomsIfExists(roomList)
  }

  protected _createNewRoomsIfNotExists(roomList: string[]): void {
    for (const roomName of roomList) {
      if (!(roomName in this._rooms)) {
        this._rooms[roomName] = {
          settings: {
            songCount: 20,
            guessTime: 30,
            gameMode: 'balanced',
            duplicate: false,
            users: []
          }
        }
      }
    }
  }

  protected _removeOldRoomsIfExists(roomList: string[]): void {
    for (const roomName in this._rooms) {
      if (!roomList.includes(roomName)) {
        delete this._rooms[roomName]
      }
    }
  }
}

export {
  GameController
}
