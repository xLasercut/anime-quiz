import {Socket} from 'socket.io'

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

export {ILog, ISocket}
