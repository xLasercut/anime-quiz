import { ServerHandler } from './common';
import { GameChatText, SOCKET_EVENTS } from 'anime-quiz-shared-resources';

class ChatHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.SEND_GAME_CHAT]: (_message: string) => {
      this._logger.debug('chat message', {
        clientData: this._socket.data.clientData,
        message: _message
      });
      const message = GameChatText.parse(_message);
      const roomId = this._socket.data.currentGameRoom;
      const chatMessage = this._chatSerialiser.generateUserMsg(this._socket, message);
      this._emitter.updateGameChat(chatMessage, roomId);
      const botChatMessage = this._chatSerialiser.generateBotMsg(message);
      if (botChatMessage) {
        this._emitter.updateGameChat(botChatMessage, roomId);
      }
    }
  };
}

export { ChatHandler };
