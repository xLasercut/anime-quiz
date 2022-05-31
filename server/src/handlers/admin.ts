import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { SHARED_EVENTS } from '../shared/events'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'

class AdminHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb

  constructor(logger: Logger, emitter: Emitter, mainDb: AnimeQuizMainDb) {
    super(logger, emitter)
    this._mainDb = mainDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.ADMIN_RELOAD_SONG_DB, async () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN008)
        this._validateIsAdmin(socket)
        await this._mainDb.reloadDb()
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
