import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class GameHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.START_GAME]: () => {
      const roomId = this._socket.data.currentGameRoom;
      const players = this._gameRooms.getPlayerList(roomId);
      const playerIds = players.map((player) => {
        return player.userId;
      });
      
    }
  };
}

export { GameHandler };
