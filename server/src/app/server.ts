import { Server as SocketIoServer } from 'socket.io';
import { ROOM_NAME_PREFIX } from '../constants';
import { SHARED_EVENTS } from '../shared/events';
import { ISocket } from '../types';
import { IGamePlayer } from '../shared/interfaces';
import { Namespace } from 'socket.io/dist/namespace';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketData } from './socket-data';

class Server extends SocketIoServer {
  declare readonly sockets: Namespace<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
  >;

  public getGameRoomList(): string[] {
    const roomList = [];
    for (const room of this.sockets.adapter.rooms) {
      roomList.push(room[0]);
    }
    return roomList.filter((roomName) => {
      return roomName.includes(ROOM_NAME_PREFIX);
    });
  }

  public isGameRoomExists(roomId: string): boolean {
    const roomList = this.getGameRoomList();
    return roomList.includes(roomId);
  }

  public reassignHost(roomId: string): void {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    for (let i = 0; i < socketIds.length; i++) {
      this.sockets.sockets.get(socketIds[i]).data.host = i === 0;
      const socket: ISocket = this.sockets.sockets.get(socketIds[i]);
      socket.emit(SHARED_EVENTS.UPDATE_CLIENT_DATA, socket.data.getClientData());
    }
  }

  public getPlayerList(roomId: string): IGamePlayer[] {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    return socketIds.map((sid) => {
      const socket: ISocket = this.sockets.sockets.get(sid);
      return socket.data.getPlayerData();
    });
  }

  public resetScore(roomId: string): void {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    for (const sid of socketIds) {
      this.sockets.sockets.get(sid).data.score = 0;
    }
  }

  public newRound(roomId: string): void {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    for (const sid of socketIds) {
      this.sockets.sockets.get(sid).data.newRound();
    }
  }

  public isLoaded(roomId: string): boolean {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    for (const sid of socketIds) {
      const socket: ISocket = this.sockets.sockets.get(sid);
      if (!socket.data.songLoaded) {
        return false;
      }
    }
    return true;
  }

  public updateScore(roomId: string): void {
    const socketIds = Array.from(this.sockets.adapter.rooms.get(roomId));
    for (const sid of socketIds) {
      this.sockets.sockets.get(sid).data.updateScore();
    }
  }

  public kickPlayer(sid: string): void {
    const socket: ISocket = this.sockets.sockets.get(sid);
    socket.disconnect();
  }
}

export { Server };
