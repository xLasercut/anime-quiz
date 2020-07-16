import {Room, Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'
import {IRoomType} from '../../shared/types/game'
import {AmqSettings} from './game/settings/amq'
import {AmqGameState} from './game/state/amq'
import {ISong} from '../../shared/interfaces/database'

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
  state: AmqGameState
}

interface IBalancedAmqSongLists {
  [key: string]: INormalAmqSongLists
}

interface INormalAmqSongLists {
  normal: Array<ISong>
  priority: Array<ISong>
}

export {ILog, ISocket, IRoom, IAmqRoom, IBalancedAmqSongLists, INormalAmqSongLists}
