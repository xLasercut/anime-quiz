import { AnimeQuizSongDb } from '../database/song'
import { Logger } from '../app/logging/logger'
import { AbstractHandler } from './abstract'
import { SHARED_EVENTS } from '../shared/events'
import { Emitter } from '../app/emitter'
import { AnimeQuizUserDb } from '../database/user'
import { NOTIFICATION_COLOR, SONG_LIST_EDIT_MODE } from '../shared/constants'
import { ROOM_IDS } from '../constants'

class SongListHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb) {
    super(logger, emitter)
    this._songDb = songDb
    this._userDb = userDb
  }

  public start(socket, errorHandler: Function): void {
    socket.on(SHARED_EVENTS.JOIN_SONG_LIST, async () => {
      try {
        socket.join(ROOM_IDS.SONG_LIST)
        this._emitter.updateSongListData(
          await this._songDb.getAllSongList(),
          await this._songDb.getAnimeList(),
          await this._songDb.getSongTitleList(),
          await this._userDb.getUserLists(),
          socket.id
        )
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.RELOAD_SONG_LIST_DATA, async () => {
      try {
        this._emitter.updateSongListData(
          await this._songDb.getAllSongList(),
          await this._songDb.getAnimeList(),
          await this._songDb.getSongTitleList(),
          await this._userDb.getUserLists(),
          socket.id
        )
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_USER_LIST, async (songIds: string[], userId: string, editMode: string, callback: Function) => {
      try {
        await this._userDb.validateUserExist(userId)
        await this._songDb.validateSongsExist(songIds)
        if (editMode === SONG_LIST_EDIT_MODE.ADD) {
          await this._userDb.validateSongsNotExistsInUserList(userId, songIds)
          await this._userDb.addSongs(userId, songIds)
          this._emitter.updateUserLists(await this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Added ${songIds.length} songs to list`)
        }
        else if (editMode === SONG_LIST_EDIT_MODE.REMOVE) {
          await this._userDb.validateSongsExistsInUserList(userId, songIds)
          await this._userDb.removeSongs(userId, songIds)
          this._emitter.updateUserLists(await this._userDb.getUserLists(), ROOM_IDS.SONG_LIST)
          this._emitter.systemNotification(NOTIFICATION_COLOR.SUCCESS, `Removed ${songIds.length} songs from list`)
        }
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  SongListHandler
}
