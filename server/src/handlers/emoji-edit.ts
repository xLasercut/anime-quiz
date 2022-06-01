import { AbstractHandler } from './abstract'
import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { AqEmoji } from '../shared/interfaces'
import { LOG_BASE } from '../app/logging/log-base'
import { NOTIFICATION_COLOR } from '../shared/constants'

class EmojiEditHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb

  constructor(logger: Logger, emitter: Emitter, mainDb: AnimeQuizMainDb) {
    super(logger, emitter)
    this._mainDb = mainDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_EMOJI_EDIT, async () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.EMOJI_EDIT)
        this._emitter.adminUpdateEmojiList(await this._mainDb.getEmojiList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_GET_EMOJI_LIST, async () => {
      try {
        this._validateIsAdmin(socket)
        this._emitter.adminUpdateEmojiList(await this._mainDb.getEmojiList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_EMOJI, async (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'add' })
        this._validateIsAdmin(socket)
        await this._mainDb.validateEmojiCommandNotExist(emoji.command)
        await this._mainDb.newEmoji(emoji)
        this._emitter.adminUpdateEmojiList(await this._mainDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${emoji.command} emoji`, socket.id)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_EMOJI, async (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'edit' })
        this._validateIsAdmin(socket)
        await this._mainDb.validateEmojiExist(emoji.emoji_id)
        await this._mainDb.validateEmojiCommandNotExist(emoji.command)
        await this._mainDb.editEmoji(emoji)
        this._emitter.adminUpdateEmojiList(await this._mainDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Edited ${emoji.command} emoji`, socket.id)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_EMOJI, async (emoji: AqEmoji, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_EMOJI_EDIT, { emoji: emoji, type: 'delete' })
        this._validateIsAdmin(socket)
        await this._mainDb.validateEmojiExist(emoji.emoji_id)
        await this._mainDb.deleteEmoji(emoji)
        this._emitter.adminUpdateEmojiList(await this._mainDb.getEmojiList(), ROOM_IDS.EMOJI_EDIT)
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
