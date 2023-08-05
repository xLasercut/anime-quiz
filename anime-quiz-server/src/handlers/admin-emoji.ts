import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { EmojiType } from '../shared/models/types';
import { LOG_REFERENCES } from '../app/logging/constants';
import { Emoji } from '../shared/models/emoji';

class AdminEmojiHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_EMOJI]: (_emoji: EmojiType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_EMOJI, {
        clientData: this._socket.data.clientData,
        request: _emoji
      });
      this._validateCanWriteDbAdmin();
      const emoji = Emoji.parse(_emoji);
      this._emojiDb.validateRecordNotExists(emoji);
      this._emojiDb.newRecord(emoji);
      this._emitter.updateStoreEmojiList();
      this._emitter.systemNotification({ color: 'success', message: `Added emoji ${emoji.command}` }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_EMOJI]: (_emoji: EmojiType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_EMOJI, {
        clientData: this._socket.data.clientData,
        request: _emoji
      });
      this._validateCanWriteDbAdmin();
      const emoji = Emoji.parse(_emoji);
      this._emojiDb.validateRecordExists(emoji);
      this._emojiDb.validateCommandNotExists(emoji);
      this._emojiDb.editRecord(emoji);
      this._emitter.updateStoreEmojiList();
      this._emitter.systemNotification({ color: 'success', message: `Edited emoji ${emoji.command}` }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_EMOJI]: (_emoji: EmojiType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_EMOJI, {
        clientData: this._socket.data.clientData,
        request: _emoji
      });
      this._validateCanWriteDbAdmin();
      const emoji = Emoji.parse(_emoji);
      this._emojiDb.validateRecordExists(emoji);
      this._emojiDb.deleteRecord(emoji);
      this._emitter.updateStoreEmojiList();
      this._emitter.systemNotification({ color: 'success', message: `Deleted emoji ${emoji.command}` }, this._socket.id);
      callback(true);
    }
  };
}

export { AdminEmojiHandler };
