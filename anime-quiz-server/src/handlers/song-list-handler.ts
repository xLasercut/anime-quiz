import {AnimeQuizDb} from '../app/database'
import {Logger} from '../app/logging/logger'
import {AbstractHandler} from './abstract-handler'
import {SHARED_EVENTS} from '../shared/events'

class SongListHandler extends AbstractHandler {
  protected _db: AnimeQuizDb

  constructor(logger: Logger, db: AnimeQuizDb) {
    super(logger)
    this._db = db
  }

  public start(socket, errorHandler): void {
    socket.on(SHARED_EVENTS.GET_SONG_LIST, async () => {
      try {
        const songList = await this._db.getAllSongList()
        socket.emit(SHARED_EVENTS.UPDATE_SONG_LIST, songList)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_ANIME_LIST, async () => {
      try {
        const animeList = await this._db.getAnimeList()
        socket.emit(SHARED_EVENTS.UPDATE_ANIME_LIST, animeList)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  SongListHandler
}
