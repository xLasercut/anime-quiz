import {Room, Socket} from 'socket.io'
import {IRoomType} from '../../shared/types/game'

interface ILog {
  code: string
  level: string
  template: string
}

interface ISocket extends Socket {
  auth: boolean
  admin: boolean
  roomId: string
  player: object
  timer: NodeJS.Timeout
}

interface IRoom extends Room {
  name: string
  type: IRoomType
}

export {ILog, ISocket, IRoom}
