import { Server } from '../app/server';
import { GamePlayerType, GameRoomIdType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';
import { ZodError } from 'zod';
import { GameRoom } from './interfaces';
import { Logger } from '../app/logger';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import { GameSettings } from './settings';
import { Socket } from '../types';
import { GameState } from './state';

class GameRooms {
  protected _io: Server;
  protected _logger: Logger;
  protected _rooms: Record<GameRoomIdType, GameRoom> = {};

  constructor(io: Server, logger: Logger) {
    this._io = io;
    this._logger = logger;
  }

  public getRoom(roomId: string): GameRoom {
    if (!(roomId in this._rooms)) {
      throw new UnauthorizedError();
    }
    return this._rooms[roomId];
  }

  public resetScore(roomId: string): void {
    const socketIds = this._io.sockets.adapter.rooms.get(roomId) || new Set();
    for (const socketId of Array.from(socketIds)) {
      this._io.sockets.sockets.get(socketId)?.data.resetScore();
    }
  }

  public getRoomList(): GameRoomIdType[] {
    const roomList: GameRoomIdType[] = [];

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

  public validateRoomNotExists(roomId: GameRoomIdType) {
    if (roomId in this._rooms) {
      throw new DataQualityError('Room already exists');
    }
  }

  public validateRoomExists(roomId: GameRoomIdType) {
    if (!(roomId in this._rooms)) {
      throw new DataQualityError('Room does not exists');
    }
  }

  public getPlayerList(roomId: GameRoomIdType): GamePlayerType[] {
    const socketIds = this._io.sockets.adapter.rooms.get(roomId) || new Set();
    return Array.from(socketIds).map((socketId) => {
      const socket = this._io.sockets.sockets.get(socketId) as Socket;
      return socket.data.playerData;
    });
  }

  public newRoom(roomId: GameRoomIdType) {
    this._rooms[roomId] = {
      settings: new GameSettings(),
      state: new GameState(this._io, roomId)
    };
  }

  public deleteRoom(roomId: GameRoomIdType) {
    this._rooms[roomId].state.stopGame();
    delete this._rooms[roomId];
  }

  public setNewHost(roomId: GameRoomIdType): Socket | undefined {
    const socketIds = this._io.sockets.adapter.rooms.get(roomId) || new Set();
    if (socketIds.size > 0) {
      const hostSocketId = Array.from(socketIds)[0];
      const hostSocket = this._io.sockets.sockets.get(hostSocketId) as Socket;
      hostSocket.data.setHost(true);
      return hostSocket;
    }
    return undefined;
  }
}

export { GameRooms };
