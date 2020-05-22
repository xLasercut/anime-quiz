import {Room, Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'
import {IRoomType} from '../../shared/types/game'
import {AmqSettings} from './game/settings/amq'

interface ILog {
  code: string
  level: string
  template: string
}

interface ISocket extends Socket {
  auth: boolean
  admin: boolean
  roomId: string
  player: AmqPlayer
  timer: NodeJS.Timeout
}

interface IRoom extends Room {
  name: string
  roomId: string
  type: IRoomType
}

interface IAmqRoom extends IRoom {
  settings: AmqSettings
}

export {ILog, ISocket, IRoom, IAmqRoom}
