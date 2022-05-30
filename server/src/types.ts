import { Socket as SocketIoSocket } from 'socket.io'
import { DefaultEventsMap, EventsMap } from 'socket.io/dist/typed-events'
import { SocketData } from './app/socket-data'

type Socket = SocketIoSocket<DefaultEventsMap, EventsMap, DefaultEventsMap, SocketData>

export {
  Socket
}

