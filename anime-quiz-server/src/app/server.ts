import { Namespace, Server as SocketIoServer, Socket } from 'socket.io';
import { SocketData } from './socket-data';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

class Server extends SocketIoServer {
  declare readonly sockets: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
}

export { Server };
