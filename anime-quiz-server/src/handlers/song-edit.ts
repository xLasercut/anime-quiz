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
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.SONG_EDIT)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  SongEditHandler
}
