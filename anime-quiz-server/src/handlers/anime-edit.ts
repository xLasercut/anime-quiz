import { AbstractHandler } from './abstract'
import { AnimeQuizSongDb } from '../database/song'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { Emitter } from '../app/emitter'
import { AqAnime } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'

class AnimeEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, songDb: AnimeQuizSongDb, emitter: Emitter) {
    super(logger, emitter)
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_ANIME_EDIT, async () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.ANIME_EDIT)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_GET_ANIME_LIST, async () => {
      try {
        this._validateIsAdmin(socket)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_ANIME, async (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN003, { anime: anime })
        this._validateIsAdmin(socket)
        await this._songDb.validateAnimeExist([anime.anime_id])
        await this._songDb.editAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} edited`, socket.id)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_ANIME, async (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN002, { anime: anime })
        this._validateIsAdmin(socket)
        await this._songDb.newAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} added`, socket.id)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_ANIME, async (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN004, { anime: anime })
        this._validateIsAdmin(socket)
        await this._songDb.validateAnimeExist([anime.anime_id])
        await this._songDb.deleteAnime(anime)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `${anime.anime_name.join(',')} deleted`, socket.id)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), ROOM_IDS.ANIME_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  AnimeEditHandler
}
