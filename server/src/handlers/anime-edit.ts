import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { Emitter } from '../app/emitter'
import { AqAnime } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { AnimeQuizSongDb } from '../database/song'

class AnimeEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb) {
    super(logger, emitter)
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_ANIME_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.ANIME_EDIT)
        this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_GET_ANIME_LIST, () => {
      try {
        this._validateIsAdmin(socket)
        this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'edit' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._songDb.validateAnimeExist([ anime.anime_id ])
        this._songDb.editAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} edited`, socket.id)
        this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'add' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._songDb.newAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} added`, socket.id)
        this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'delete' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._songDb.validateAnimeExist([ anime.anime_id ])
        this._songDb.deleteAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} deleted`, socket.id)
        this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })
  }
}

export {
  AnimeEditHandler
}
