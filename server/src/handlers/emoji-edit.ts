import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { IEmoji } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { EmojiDb } from '../database/emoji';
import { EmojiDbEmitter } from '../emitters/emoji';
import { SystemEmitter } from '../emitters/system';
import { Emoji, NewEmoji } from '../models/emoji';
import { Server } from '../app/server';
import { SUCCESS } from '../shared/constants/colors';

class EmojiEditHandler extends AbstractHandler {
  protected _emojiDb: EmojiDb;
  protected _emojiDbEmitter: EmojiDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(io: Server, logger: Logger, emojiDb: EmojiDb) {
    super(logger);
    this._emojiDb = emojiDb;
    this._emojiDbEmitter = new EmojiDbEmitter(io, emojiDb);
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_EMOJI_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.EMOJI_EDIT);
        this._emojiDbEmitter.updateEmojiList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_EMOJI, (_emoji: IEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: _emoji, type: 'add' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateDbNotLocked();
        const emoji = new NewEmoji(_emoji).dict();
        this._emojiDb.validateEmojiCommandNotExist(emoji.command);
        this._emojiDb.newEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(SUCCESS, `Added ${emoji.command} emoji`, socket.id);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_EMOJI, (_emoji: IEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: _emoji, type: 'edit' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateDbNotLocked();
        const emoji = new Emoji(_emoji).dict();
        this._emojiDb.validateEmojiExist(emoji.emoji_id);
        this._emojiDb.validateEmojiCommandNotExist(emoji.command);
        this._emojiDb.editEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(SUCCESS, `Edited ${emoji.command} emoji`, socket.id);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_EMOJI, (_emoji: IEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: _emoji, type: 'delete' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateDbNotLocked();
        const emoji = new Emoji(_emoji).dict();
        this._emojiDb.validateEmojiExist(emoji.emoji_id);
        this._emojiDb.deleteEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(
          SUCCESS,
          `Deleted ${emoji.command} emoji`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });
  }
}

export { EmojiEditHandler };
