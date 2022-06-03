import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { AqEmoji } from '../shared/interfaces'
import { LOG_BASE } from '../app/logging/log-base'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { AnimeQuizEmojiDb } from '../database/emoji'

class EmojiEditHandler extends AbstractHandler {
  protected _emojiDb: AnimeQuizEmojiDb

  constructor(logger: Logger, emitter: Emitter, emojiDb: AnimeQuizEmojiDb) {
    super(logger, emitter)
    this._emojiDb = emojiDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_EMOJI_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.EMOJI_EDIT)
        this._emitter.adminUpdateEmojiList(this._emojiDb.getEmojiList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_GET_EMOJI_LIST, () => {
      try {
        this._validateIsAdmin(socket)
        this._emitter.adminUpdateEmojiList(this._emojiDb.getEmojiList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'add' })
        this._validateIsAdmin(socket)
        this._emojiDb.validateEmojiCommandNotExist(emoji.command)
        this._emojiDb.newEmoji(emoji)
        this._emitter.adminUpdateEmojiList(this._emojiDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${emoji.command} emoji`, socket.id)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'edit' })
        this._validateIsAdmin(socket)
        this._emojiDb.validateEmojiExist(emoji.emoji_id)
        this._emojiDb.validateEmojiCommandNotExist(emoji.command)
        this._emojiDb.editEmoji(emoji)
        this._emitter.adminUpdateEmojiList(this._emojiDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Edited ${emoji.command} emoji`, socket.id)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_EMOJI, (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'delete' })
        this._validateIsAdmin(socket)
        this._emojiDb.validateEmojiExist(emoji.emoji_id)
        this._emojiDb.deleteEmoji(emoji)
        this._emitter.adminUpdateEmojiList(this._emojiDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Deleted ${emoji.command} emoji`, socket.id)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  EmojiEditHandler
}
