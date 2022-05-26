import { Logger } from '../app/logging/logger'
import { AqGameState } from '../shared/interfaces'

class GameStates {
  protected _logger: Logger
  protected _states: { [key: string]: AqGameState }

  constructor(logger: Logger) {
    this._logger = logger
    this._states = {}
  }

  public addRoom(roomId: string): void {
    this._states[roomId] = {
      playing: false,
      maxSongCount: 0,
      currentSongCount: 0,
      startPosition: 0,
      gameList: [],
      songOverride: null,
      currentSong: {
        song_id: '',
        anime_name: [],
        song_title: '',
        artist: '',
        src: '',
        type: '',
        anime_id: ''
      }
    }
  }

  public deleteRoom(roomId: string): void {
    delete this._states[roomId]
  }
}

export {
  GameStates
}
