import { Server } from '../app/server';
import { GameRoomIdType, GameRoomSettingsType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';
import { ZodError } from 'zod';
import { GameRoom } from './interfaces';
import { Logger } from '../app/logger';
import { DataQualityError } from '../app/exceptions';
import { GAME_MODES } from '../shared/game-modes';

class GameRooms {
  protected _io: Server;
  protected _logger: Logger;
  protected _rooms: Record<GameRoomIdType, GameRoom> = {};

  constructor(io: Server, logger: Logger) {
    this._io = io;
    this._logger = logger;
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

  public getRoomSettings(roomId: GameRoomIdType): GameRoomSettingsType {
    return this._rooms[roomId].settings;
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
      settings: {
        songCount: 20,
        guessTime: 30,
        duplicate: false,
        gameMode: GAME_MODES.NORMAL
      }
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
