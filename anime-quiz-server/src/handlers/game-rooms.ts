import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { GameRoomIdType } from '../shared/models/types';
import { GameRoomId } from '../shared/models/game';

class GameRoomsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.GET_ROOM_LIST]: () => {
      this._emitter.updateRoomList(this._socket.id);
    },
    [SOCKET_EVENTS.NEW_GAME_ROOM]: (_roomId: GameRoomIdType) => {
      const roomId = GameRoomId.parse(_roomId);
      this._socket.join(roomId);
    }
  };
}

export { GameRoomsHandler };
