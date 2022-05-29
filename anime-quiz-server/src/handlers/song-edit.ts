import { AbstractHandler } from './abstract'
import { AnimeQuizSongDb } from '../database/song'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'

class SongEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, emitter: Emitter, songDb: AnimeQuizSongDb) {
    super(logger, emitter)
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, async () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.SONG_EDIT)
        this._emitter.adminUpdateSongList(await this._songDb.getAllSongList(), socket.id)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), socket.id)
        this._emitter.updateSongTitleList(await this._songDb.getSongTitleList(), socket.id)
        this._emitter.updateAnimeList(await this._songDb.getAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.ADMIN_RELOAD_SONG_LIST_DATA, async () => {
      try {
        this._validateIsAdmin(socket)
        this._emitter.adminUpdateSongList(await this._songDb.getAllSongList(), socket.id)
        this._emitter.adminUpdateAnimeList(await this._songDb.getAnimeListAdmin(), socket.id)
        this._emitter.updateSongTitleList(await this._songDb.getSongTitleList(), socket.id)
        this._emitter.updateAnimeList(await this._songDb.getAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  SongEditHandler
}
