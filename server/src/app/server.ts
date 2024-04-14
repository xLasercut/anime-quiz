import { Namespace, Server as SocketIoServer } from 'socket.io';
import { SocketData } from './socket-data';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { TGameRoomId } from 'anime-quiz-shared-resources/src/models/types';

class Server extends SocketIoServer {
  declare readonly sockets: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

  public getSocketIds(roomId: TGameRoomId): string[] {
    return Array.from(this.sockets.adapter.rooms.get(roomId) || new Set());
  }
}

export { Server };
