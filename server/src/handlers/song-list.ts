import { Logger } from '../app/logging/logger'
import { AbstractHandler } from './abstract'
import { SHARED_EVENTS } from '../shared/events'
import { Emitter } from '../app/emitter'
import { AnimeQuizUserDb } from '../database/user'
import { NOTIFICATION_COLOR, SONG_LIST_EDIT_MODE } from '../shared/constants'
import { ROOM_IDS } from '../constants'
import { Socket } from '../types'
import { AnimeQuizSongDb } from '../database/song'

class SongListHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb) {
    super(logger, emitter)
    this._songDb = songDb
    this._userDb = userDb
  }

  public start(socket: Socket, errorHandler: Function): void {
    socket.on(SHARED_EVENTS.JOIN_SONG_LIST, () => {
      try {
        socket.join(ROOM_IDS.SONG_LIST)
        this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.RELOAD_SONG_LIST_DATA, () => {
      try {
        this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_USER_LIST, (songIds: string[], userId: string, editMode: string, callback: Function) => {
      try {
        this._userDb.validateLessThanFiftySongs(songIds)
        this._userDb.validateUserExist(userId)
        this._songDb.validateSongsExist(songIds)
        if (editMode === SONG_LIST_EDIT_MODE.ADD) {
          this._userDb.validateSongsNotExistsInUserList(userId, songIds)
          this._userDb.addSongs(userId, songIds)
          this._emitter.updateUserLists(this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${songIds.length} songs to list`, socket.id)
        }
        else if (editMode === SONG_LIST_EDIT_MODE.REMOVE) {
          this._userDb.validateSongsExistsInUserList(userId, songIds)
          this._userDb.removeSongs(userId, songIds)
          this._emitter.updateUserLists(this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Removed ${songIds.length} songs from list`, socket.id)
        }
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }

  protected _reloadSongListData(sid: string): void {
    this._emitter.updateSongList(this._songDb.getSongList(), sid)
    this._emitter.updateAnimeList(this._songDb.getAnimeList(), sid)
    this._emitter.updateSongTitleList(this._songDb.getSongTitleList(), sid)
    this._emitter.updateUserLists(this._userDb.getUserLists(), sid)
  }
}

export {
  SongListHandler
}
