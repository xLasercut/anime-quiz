import {Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'
import {AmqSettings} from './game/settings/amq'
import {AmqGameState} from './game/state/amq'
import {IAmqSong} from '../../shared/interfaces/database'
import {AiqSettings} from './game/settings/aiq'
import {AiqGameState} from './game/state/aiq'
import {AiqPlayer} from './game/players/aiq'

interface ILog {
  code: string
  level: string
  template: string
}

interface ISocket extends Socket {
  auth: boolean
  admin: boolean
  player: AmqPlayer | AiqPlayer
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
  settings: AiqSettings
  state: AiqGameState
}

interface IBalancedAmqSongLists {
  [key: string]: INormalAmqSongLists
}

interface INormalAmqSongLists {
  normal: Array<IAmqSong>
  priority: Array<IAmqSong>
}

export {ILog, ISocket, IRoom, IAmqRoom, IBalancedAmqSongLists, INormalAmqSongLists, IAwqRoom}
