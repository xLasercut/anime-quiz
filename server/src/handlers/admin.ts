import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { SHARED_EVENTS } from '../shared/events'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { Server } from '../app/server'
import { AnimeQuizEmojiDb } from '../database/emoji'
import { AnimeQuizSongDb } from '../database/song'

class AdminHandler extends AbstractHandler {
  protected _emojiDb: AnimeQuizEmojiDb
  protected _songDb: AnimeQuizSongDb
  protected _io: Server

  constructor(logger: Logger, emitter: Emitter, io: Server, songDb: AnimeQuizSongDb, emojiDb: AnimeQuizEmojiDb) {
    super(logger, emitter)
    this._songDb = songDb
    this._io = io
    this._emojiDb = emojiDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.ADMIN_RELOAD_DB, () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_RELOAD_DB)
        this._validateIsAdmin(socket)
        this._songDb.reloadDb()
        this._songDb.reloadCache()
        this._emojiDb.reloadDb()
        this._emojiDb.reloadCache()
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, 'Database reloaded')
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_KICK_PLAYER, (playerId: string) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_KICK_PLAYER, { kickedPlayerId: playerId })
        this._validateIsAdmin(socket)
        this._emitter.systemNotification(NOTIFICATION_COLOR.ERROR, 'You have been kicked', playerId)
        this._io.kickPlayer(playerId)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  AdminHandler
}
