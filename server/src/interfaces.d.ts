import {Socket} from 'socket.io'
import {AmqPlayer} from './game/players/amq'
import {AmqSettings} from './game/settings/amq'
import {AmqGameState} from './game/state/amq'
import {IAmqSong} from '../../shared/interfaces/database'
import {IAmqGuess} from '../../shared/interfaces/amq'

interface ILog {
  code: string
  level: string
  template: string
}

interface ISocket extends Socket {
  auth: boolean
  admin: boolean
  player: AmqPlayer
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

interface IBalancedAmqSongLists {
  [key: string]: INormalAmqSongLists
}

interface INormalAmqSongLists {
  normal: Array<IAmqSong>
  priority: Array<IAmqSong>
}

interface IPlayerTimedGuess {
  guess: IAmqGuess
  guessTime: Date
  socketId: string
}

export {ILog, ISocket, IRoom, IAmqRoom, IBalancedAmqSongLists, INormalAmqSongLists, IPlayerTimedGuess}
