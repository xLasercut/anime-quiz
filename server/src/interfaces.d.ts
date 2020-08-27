import {Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'
import {AmqSettings} from './game/settings/amq'
import {AmqGameState} from './game/state/amq'
import {IAmqSong} from '../../shared/interfaces/database'
import {AwqSettings} from './game/settings/awq'
import {AwqGameState} from './game/state/awq'
import {AwqPlayer} from './game/players/awq'

interface ILog {
  code: string
  level: string
  template: string
}

interface ISocket extends Socket {
  auth: boolean
  admin: boolean
  player: AmqPlayer | AwqPlayer
  timer: NodeJS.Timeout
}

interface IRoom {
  name: string
  players: Set<string>
  countdown: NodeJS.Timer
  timeout: NodeJS.Timeout
}

interface IAmqRoom extends IRoom {
  settings: AmqSettings
  state: AmqGameState
}

interface IAwqRoom extends IRoom {
  settings: AwqSettings
  state: AwqGameState
}

interface IBalancedAmqSongLists {
  [key: string]: INormalAmqSongLists
}

interface INormalAmqSongLists {
  normal: Array<IAmqSong>
  priority: Array<IAmqSong>
}

export {ILog, ISocket, IRoom, IAmqRoom, IBalancedAmqSongLists, INormalAmqSongLists, IAwqRoom}
