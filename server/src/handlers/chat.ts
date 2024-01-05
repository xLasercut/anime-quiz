import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class ChatHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.SEND_GAME_CHAT]: (message: string) => {
      const roomId = this._socket.data.currentGameRoom;
      this._emitter.updateGameChat(this._socket, message, roomId);
    }
  };
}

export { ChatHandler };
