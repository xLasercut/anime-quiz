import { AnimeQuizDb } from '../app/database'
import { Logger } from '../app/logging/logger'
import { AbstractHandler } from './abstract-handler'
import { SHARED_EVENTS } from '../shared/events'
import { LOG_BASE } from '../app/logging/log-base'
import { Emitter } from '../app/emitter'

class SongListHandler extends AbstractHandler {
  protected _db: AnimeQuizDb
  protected _emitter: Emitter
  protected _roomId: string

  constructor(logger: Logger, emitter: Emitter, db: AnimeQuizDb) {
    super(logger)
    this._db = db
    this._emitter = emitter
    this._roomId = 'SONG_LIST'
  }

  public start(socket, errorHandler: Function): void {
    socket.on(SHARED_EVENTS.JOIN_SONG_LIST, async () => {
      try {
        socket.join(this._roomId)
        this._logger.writeLog(LOG_BASE.SERVER005, {
          id: socket.id,
          username: socket.data.username,
          roomId: this._roomId
        })
        this._emitter.updateSongList(await this._db.getAllSongList(), socket.id)
        this._emitter.updateAnimeList(await this._db.getAnimeList(), socket.id)
        this._emitter.updateSongTitleList(await this._db.getSongTitleList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })


    socket.on(SHARED_EVENTS.GET_SONG_LIST, async () => {
      try {
        this._emitter.updateSongList(await this._db.getAllSongList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_ANIME_LIST, async () => {
      try {
        this._emitter.updateAnimeList(await this._db.getAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_SONG_TITLE_LIST, async () => {
      try {
        this._emitter.updateSongTitleList(await this._db.getSongTitleList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  SongListHandler
}
