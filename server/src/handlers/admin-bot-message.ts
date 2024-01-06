import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { BotMessageType } from '../shared/models/types';
import { BotMessage } from '../shared/models/bot-message';

class AdminBotMessageHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_BOT_MESSAGE]: (_botMessage: BotMessageType, callback: Function) => {
      this._logger.info('admin add bot message', {
        clientData: this._socket.data.clientData,
        request: _botMessage
      });
      this._validateCanWriteDbAdmin();
      const botMessage = BotMessage.parse(_botMessage);
      this._botMessageDb.validateRecordNotExists(botMessage);
      this._botMessageDb.newRecord(botMessage);
      this._emitter.updateStoreBotMessageList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Added bot message ${botMessage.command}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_BOT_MESSAGE]: (_botMessage: BotMessageType, callback: Function) => {
      this._logger.info('admin edit bot message', {
        clientData: this._socket.data.clientData,
        request: _botMessage
      });
      this._validateCanWriteDbAdmin();
      const botMessage = BotMessage.parse(_botMessage);
      this._botMessageDb.validateRecordExists(botMessage);
      this._botMessageDb.validateCommandNotExists(botMessage);
      this._botMessageDb.editRecord(botMessage);
      this._emitter.updateStoreBotMessageList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Edited bot message ${botMessage.command}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_BOT_MESSAGE]: (_botMessage: BotMessageType, callback: Function) => {
      this._logger.info('admin delete bot message', {
        clientData: this._socket.data.clientData,
        request: _botMessage
      });
      this._validateCanWriteDbAdmin();
      const botMessage = BotMessage.parse(_botMessage);
      this._botMessageDb.validateRecordExists(botMessage);
      this._botMessageDb.deleteRecord(botMessage);
      this._emitter.updateStoreBotMessageList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Deleted bot message ${botMessage.command}`
        },
        this._socket.id
      );
      callback(true);
    }
  };
}

export { AdminBotMessageHandler };
