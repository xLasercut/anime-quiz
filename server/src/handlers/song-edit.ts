import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { AqSong } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { AnimeQuizUserDb } from '../database/user'
import { AnimeQuizSongDb } from '../database/song'

class SongEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb) {
    super(logger, emitter)
    this._songDb = songDb
    this._userDb = userDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.SONG_EDIT)
        this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_RELOAD_SONG_LIST_DATA, () => {
      try {
        this._validateIsAdmin(socket)
        this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_NEW_SONG, (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: song, type: 'add' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._songDb.validateAnimeExist(song.anime_id)
        this._songDb.newSong(song)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${song.song_title}`, socket.id)
        this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_DELETE_SONG, (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: song, type: 'delete' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._userDb.validateIsDbLocked()
        this._songDb.validateSongsExist([ song.song_id ])
        this._songDb.deleteSong(song)
        this._userDb.removeSongAll(song.song_id)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Deleted ${song.song_title}`, socket.id)
        this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_EDIT_SONG, (song: AqSong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: song, type: 'edit' })
        this._validateIsAdmin(socket)
        this._songDb.validateIsDbLocked()
        this._songDb.validateSongsExist([ song.song_id ])
        this._songDb.validateAnimeExist(song.anime_id)
        this._songDb.editSong(song)
        this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Edited ${song.song_title}`, socket.id)
        this._reloadSongListData(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })
  }

  protected _reloadSongListData(sid: string): void {
    this._emitter.adminUpdateSongList(this._songDb.getSongList(), sid)
    this._emitter.adminUpdateAnimeList(this._songDb.getAdminAnimeList(), sid)
    this._emitter.updateSongTitleList(this._songDb.getSongTitleList(), sid)
    this._emitter.updateAnimeList(this._songDb.getAnimeList(), sid)
  }
}

export {
  SongEditHandler
}
