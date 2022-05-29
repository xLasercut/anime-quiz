import { AbstractHandler } from './abstract'
import { AnimeQuizSongDb } from '../database/song'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'
import { Emitter } from '../app/emitter'

class AnimeListEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, songDb: AnimeQuizSongDb, emitter: Emitter) {
    super(logger, emitter)
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_ANIME_LIST_EDIT, async () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.ANIME_LIST_EDIT)
        this._emitter.updateAnimeList(await this._songDb.getAnimeList(), socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  AnimeListEditHandler
}
