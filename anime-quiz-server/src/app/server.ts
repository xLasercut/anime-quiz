import { Server as SocketIoServer } from 'socket.io'
import { ROOM_NAME_PREFIX } from '../constants'

class Server extends SocketIoServer {
  public getGameRoomList(): string[] {
    const roomList = []
    for (const room of this.sockets.adapter.rooms) {
      roomList.push(room[0])
    }
    return roomList.filter((roomName) => {
      return roomName.includes(ROOM_NAME_PREFIX)
    })
  }
}

export {
  Server
}
