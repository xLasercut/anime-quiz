import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { GameRoomIdType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';

class GameRoomsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.LEAVE_ALL_ROOMS]: () => {
      for (const roomId of Array.from(this._socket.rooms)) {
        if (roomId !== this._socket.id) {
          this._socket.leave(roomId);
        }
      }
    },
    [SOCKET_EVENTS.GET_ROOM_LIST]: () => {
      this._emitter.updateRoomList(this._socket.id);
    },
    [SOCKET_EVENTS.NEW_GAME_ROOM]: (_roomId: GameRoomIdType, callback: Function) => {
      this._logger.info('new game room request', {
        clientData: this._socket.data.clientData,
        request: _roomId
      });
      const roomId = GameRoomId.parse(_roomId);
      this._gameRooms.validateRoomNotExists(roomId);
      this._socket.join(roomId);
      callback(true);
    },
    [SOCKET_EVENTS.JOIN_GAME_ROOM]: (_roomId: GameRoomIdType, callback: Function) => {
      this._logger.info('join game room request', {
        clientData: this._socket.data.clientData,
        request: _roomId
      });
      const roomId = GameRoomId.parse(_roomId);
      this._gameRooms.validateRoomExists(roomId);
      this._socket.join(roomId);
      callback(true);
    }
  };
}

export { GameRoomsHandler };
