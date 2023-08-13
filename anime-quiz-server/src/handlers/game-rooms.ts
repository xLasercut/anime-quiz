import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { GameRoomIdType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';

class GameRoomsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.GET_ROOM_LIST]: () => {
      this._emitter.updateRoomList(this._socket.id);
    },
    [SOCKET_EVENTS.NEW_GAME_ROOM]: (_roomId: GameRoomIdType, callback: Function) => {
      this._logger.info('new game room', {
        clientData: this._socket.data.clientData,
        request: _roomId
      });
      const roomId = GameRoomId.parse(_roomId);
      this._gameRooms.validateRoomNotExists(roomId);
      this._socket.join(roomId);
      callback(true);
    }
  };
}

export { GameRoomsHandler };
