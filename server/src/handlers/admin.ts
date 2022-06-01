import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { SHARED_EVENTS } from '../shared/events'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { Server } from '../app/server'

class AdminHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb
  protected _io: Server

  constructor(logger: Logger, emitter: Emitter, io: Server, mainDb: AnimeQuizMainDb) {
    super(logger, emitter)
    this._mainDb = mainDb
    this._io = io
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.ADMIN_RELOAD_MAIN_DB, async () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_RELOAD_DB, { db: 'main' })
        this._validateIsAdmin(socket)
        await this._mainDb.reloadDb()
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
