import { AbstractHandler } from './abstract'
import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { AqSong } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { AnimeQuizUserDb } from '../database/user'

class SongEditHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, emitter: Emitter, mainDb: AnimeQuizMainDb, userDb: AnimeQuizUserDb) {
    super(logger, emitter)
    this._mainDb = mainDb
    this._userDb = userDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, async () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.SONG_EDIT)
        await this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_RELOAD_SONG_LIST_DATA, async () => {
      try {
        this._validateIsAdmin(socket)
        await this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_SONG, async (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN005, { song: song })
        this._validateIsAdmin(socket)
        await this._mainDb.validateAnimeExist(song.anime_id)
        await this._mainDb.newSong(song)
        await this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${song.song_title}`, socket.id)
        await this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_SONG, async (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN007, { song: song })
        this._validateIsAdmin(socket)
        await this._mainDb.validateSongsExist([song.song_id])
        await this._mainDb.deleteSong(song)
        await this._userDb.removeSongAll(song.song_id)
        await this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Deleted ${song.song_title}`, socket.id)
        await this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_SONG, async (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN006, { song: song })
        this._validateIsAdmin(socket)
        await this._mainDb.validateSongsExist([song.song_id])
        await this._mainDb.validateAnimeExist(song.anime_id)
        await this._mainDb.editSong(song)
        await this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Edited ${song.song_title}`, socket.id)
        await this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }

  protected async _reloadSongListData(sid: string): Promise<void> {
    this._emitter.adminUpdateSongList(await this._mainDb.getAllSongList(), sid)
    this._emitter.adminUpdateAnimeList(await this._mainDb.getAnimeListAdmin(), sid)
    this._emitter.updateSongTitleList(await this._mainDb.getSongTitleList(), sid)
    this._emitter.updateAnimeList(await this._mainDb.getAnimeList(), sid)
  }
}

export {
  SongEditHandler
}
