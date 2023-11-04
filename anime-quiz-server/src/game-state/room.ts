import { Server } from '../app/server';
import { GameRoomIdType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';
import { ZodError } from 'zod';
import { GameRoom } from './interfaces';
import { Logger } from '../app/logger';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import { GameSettings } from './settings';

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

  public getPlayerRoomId(sid: string): string {
    for (const roomId in this._rooms) {
      if (this._rooms[roomId].sids.has(sid)) {
        return roomId;
      }
    }
    throw new UnauthorizedError();
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

  public newRoom(roomId: GameRoomIdType) {
    this._rooms[roomId] = {
      sids: new Set(),
      settings: new GameSettings()
    };
  }

  public deleteRoom(roomId: GameRoomIdType) {
    delete this._rooms[roomId];
  }

  public addPlayer(roomId: GameRoomIdType, sid: string) {
    this._rooms[roomId].sids.add(sid);
  }

  public deletePlayer(roomId: GameRoomIdType, sid: string) {
    this._rooms[roomId].sids.delete(sid);
  }
}

export { GameRooms };
