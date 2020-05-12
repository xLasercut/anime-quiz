import {Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'

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

export {ILog, ISocket}
