import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { AnimeQuizSongDb } from '../database/song'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { SHARED_EVENTS } from '../shared/events'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'

class AdminHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb) {
    super(logger, emitter)
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.ADMIN_RELOAD_SONG_DB, async () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN008)
        this._validateIsAdmin(socket)
        await this._songDb.reloadDb()
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, 'Database reloaded')
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  AdminHandler
}
