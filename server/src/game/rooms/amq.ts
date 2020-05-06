import {AbstractGameRooms} from './abstract'
import {Server} from 'socket.io'

class AmqRooms extends AbstractGameRooms {
  constructor(io: Server) {
    super(io, 'amq')
  }

  newRoom(roomId: string): void {
    this.getRoom(roomId)

  }
}

export {AmqRooms}
