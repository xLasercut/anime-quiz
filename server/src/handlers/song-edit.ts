import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { AqSong } from '../shared/interfaces'
import { NOTIFICATION_COLOR } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { AnimeQuizUserDb } from '../database/user'
import { AnimeQuizSongDb } from '../database/song'
import { SongDbEmitter } from '../emitters/song'
import { SystemEmitter } from '../emitters/system'

class SongEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb
  protected _userDb: AnimeQuizUserDb
  protected _songDbEmitter: SongDbEmitter
  protected _systemEmitter: SystemEmitter

  constructor(
    logger: Logger,
    songDb: AnimeQuizSongDb,
    userDb: AnimeQuizUserDb,
    songDbEmitter: SongDbEmitter,
    systemEmitter: SystemEmitter
  ) {
    super(logger)
    this._songDb = songDb
    this._userDb = userDb
    this._songDbEmitter = songDbEmitter
    this._systemEmitter = systemEmitter
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.SONG_EDIT)
        this._songDbEmitter.updateSongList(socket.id)
        this._songDbEmitter.updateSongTitleList(socket.id)
        this._songDbEmitter.updateAnimeList(socket.id)
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
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Added ${song.song_title}`,
          socket.id
        )
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT)
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
        this._songDb.validateSongsExist([song.song_id])
        this._songDb.deleteSong(song)
        this._userDb.removeSongAll(song.song_id)
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Deleted ${song.song_title}`,
          socket.id
        )
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT)
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
        this._songDb.validateSongsExist([song.song_id])
        this._songDb.validateAnimeExist(song.anime_id)
        this._songDb.editSong(song)
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Edited ${song.song_title}`,
          socket.id
        )
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })
  }
}

export { SongEditHandler }
