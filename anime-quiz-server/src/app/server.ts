import { Server as SocketIoServer } from 'socket.io'
import { ROOM_NAME_PREFIX } from '../constants'
import { SHARED_EVENTS } from '../shared/events'
import { Socket } from '../types'
import { AqGamePlayer } from '../shared/interfaces'

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

  public isGameRoomExists(roomId: string): boolean {
    const roomList = this.getGameRoomList()
    return roomList.includes(roomId)
  }

  public reassignHost(roomId: string): void {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId))
    for (let i = 0; i < socketIds.length; i++) {
      const socket: Socket = this.sockets.sockets.get(socketIds[i])
      socket.data.host = i === 0
      socket.emit(SHARED_EVENTS.UPDATE_CLIENT_DATA, socket.data.getClientData())
    }
  }

  public getPlayerList(roomId: string): AqGamePlayer[] {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId))
    return socketIds.map((sid) => {
      const socket: Socket = this.sockets.sockets.get(sid)
      return socket.data.getPlayerData()
    })
  }
}

export {
  Server
}
