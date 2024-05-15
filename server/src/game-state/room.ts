import { Server } from '../app/server';
import { GameRoomId, TGamePlayer, TGameRoomId } from 'anime-quiz-shared-resources';
import { ZodError } from 'zod';
import { TGameRoom } from './interfaces';
import { Logger } from 'winston';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import { GameSettings } from './settings';
import { Socket } from '../types';
import { GameState } from './state';

class GameRooms {
  protected _io: Server;
  protected _logger: Logger;
  protected _rooms: Record<TGameRoomId, TGameRoom> = {};

  constructor(io: Server, logger: Logger) {
    this._io = io;
    this._logger = logger;
  }

  public getRoom(roomId: string): TGameRoom {
    if (!(roomId in this._rooms)) {
      throw new UnauthorizedError();
    }
    return this._rooms[roomId];
  }

  public getRoomList(): TGameRoomId[] {
    const roomList: TGameRoomId[] = [];

    for (const [_roomId, _] of this._io.sockets.adapter.rooms) {
      try {
        const roomId = GameRoomId.parse(_roomId);
        roomList.push(roomId);
      } catch (e) {
        if (!(e instanceof ZodError)) {
          throw e;
        }
      }
    }
    return roomList;
  }

  public roomExists(roomId: TGameRoomId): boolean {
    return roomId in this._rooms;
  }

  public getPlayerList(roomId: TGameRoomId): TGamePlayer[] {
    return this._io.getSocketIds(roomId).map((socketId) => {
      const socket = this._io.sockets.sockets.get(socketId) as Socket;
      return socket.data.playerData;
    });
  }

  public newRoom(roomId: TGameRoomId) {
    this._rooms[roomId] = {
      settings: new GameSettings(),
      state: new GameState(this._io, roomId)
    };
  }

  public deleteRoom(roomId: TGameRoomId) {
    this._rooms[roomId].state.stopGame();
    delete this._rooms[roomId];
  }

  public setNewHost(roomId: TGameRoomId): Socket | undefined {
    const socketIds = this._io.getSocketIds(roomId);
    if (socketIds.length > 0) {
      const hostSocketId = socketIds[0];
      const hostSocket = this._io.sockets.sockets.get(hostSocketId) as Socket;
      hostSocket.data.setHost(true);
      return hostSocket;
    }
    return undefined;
  }
}

export { GameRooms };
