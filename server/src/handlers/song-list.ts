import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { AbstractHandler } from './abstract'
import { SHARED_EVENTS } from '../shared/events'
import { Emitter } from '../app/emitter'
import { AnimeQuizUserDb } from '../database/user'
import { NOTIFICATION_COLOR, SONG_LIST_EDIT_MODE } from '../shared/constants'
import { ROOM_IDS } from '../constants'
import { Socket } from '../types'

class SongListHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, emitter: Emitter, mainDb: AnimeQuizMainDb, userDb: AnimeQuizUserDb) {
    super(logger, emitter)
    this._mainDb = mainDb
    this._userDb = userDb
  }

  public start(socket: Socket, errorHandler: Function): void {
    socket.on(SHARED_EVENTS.JOIN_SONG_LIST, async () => {
      try {
        socket.join(ROOM_IDS.SONG_LIST)
        await this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.RELOAD_SONG_LIST_DATA, async () => {
      try {
        await this._reloadSongListData(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_USER_LIST, async (songIds: string[], userId: string, editMode: string, callback: Function) => {
      try {
        await this._userDb.validateLessThanFiftySongs(songIds)
        await this._userDb.validateUserExist(userId)
        await this._mainDb.validateSongsExist(songIds)
        if (editMode === SONG_LIST_EDIT_MODE.ADD) {
          await this._userDb.validateSongsNotExistsInUserList(userId, songIds)
          await this._userDb.addSongs(userId, songIds)
          this._emitter.updateUserLists(await this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${songIds.length} songs to list`, socket.id)
        }
        else if (editMode === SONG_LIST_EDIT_MODE.REMOVE) {
          await this._userDb.validateSongsExistsInUserList(userId, songIds)
          await this._userDb.removeSongs(userId, songIds)
          this._emitter.updateUserLists(await this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Removed ${songIds.length} songs from list`, socket.id)
        }
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }

  protected async _reloadSongListData(sid: string): Promise<void> {
    this._emitter.updateSongList(await this._mainDb.getAllSongList(), sid)
    this._emitter.updateAnimeList(await this._mainDb.getAnimeList(), sid)
    this._emitter.updateSongTitleList(await this._mainDb.getSongTitleList(), sid)
    this._emitter.updateUserLists(await this._userDb.getUserLists(), sid)
  }
}

export {
  SongListHandler
}
