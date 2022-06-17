import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { Socket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { AqEmoji } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { NOTIFICATION_COLOR } from '../shared/constants';
import { AnimeQuizEmojiDb } from '../database/emoji';
import { EmojiDbEmitter } from '../emitters/emoji';
import { SystemEmitter } from '../emitters/system';

class EmojiEditHandler extends AbstractHandler {
  protected _emojiDb: AnimeQuizEmojiDb;
  protected _emojiDbEmitter: EmojiDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(
    logger: Logger,
    emojiDb: AnimeQuizEmojiDb,
    emojiDbEmitter: EmojiDbEmitter,
    systemEmitter: SystemEmitter
  ) {
    super(logger);
    this._emojiDb = emojiDb;
    this._emojiDbEmitter = emojiDbEmitter;
    this._systemEmitter = systemEmitter;
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_EMOJI_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.EMOJI_EDIT);
        this._emojiDbEmitter.updateEmojiList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'add' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateIsDbLocked();
        this._emojiDb.validateEmojiCommandNotExist(emoji.command);
        this._emojiDb.newEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Added ${emoji.command} emoji`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'edit' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateIsDbLocked();
        this._emojiDb.validateEmojiExist(emoji.emoji_id);
        this._emojiDb.validateEmojiCommandNotExist(emoji.command);
        this._emojiDb.editEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Edited ${emoji.command} emoji`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'delete' });
        this._validateIsAdmin(socket);
        this._emojiDb.validateIsDbLocked();
        this._emojiDb.validateEmojiExist(emoji.emoji_id);
        this._emojiDb.deleteEmoji(emoji);
        this._emojiDbEmitter.updateEmojiList(ROOM_IDS.EMOJI_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
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
