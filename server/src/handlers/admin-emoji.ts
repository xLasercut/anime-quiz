import { ServerHandler } from './common';
import { Emoji, SOCKET_EVENTS, TEmoji } from 'anime-quiz-shared-resources';

class AdminEmojiHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_EMOJI]: (_emoji: TEmoji, callback: Function) => {
      this._logger.info('admin add emoji', {
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
    [SOCKET_EVENTS.ADMIN_EDIT_EMOJI]: (_emoji: TEmoji, callback: Function) => {
      this._logger.info('admin edit emoji', {
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
    [SOCKET_EVENTS.ADMIN_DELETE_EMOJI]: (_emoji: TEmoji, callback: Function) => {
      this._logger.info('admin delete emoji', {
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
