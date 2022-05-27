import { Logger } from '../app/logging/logger'
import { AqGameStateRaw } from '../interfaces'
import { AqGameState, AqSong } from '../shared/interfaces'
import { Server } from '../app/server'

class GameStates {
  protected _logger: Logger
  protected _states: { [key: string]: AqGameStateRaw }
  protected _io: Server

  constructor(logger: Logger, io: Server) {
    this._logger = logger
    this._io = io
    this._states = {}
  }

  public addRoom(roomId: string): void {
    this._states[roomId] = {
      playing: false,
      currentSongCount: 0,
      startPosition: 0,
      gameList: [],
      songOverride: null,
      countdown: null,
      timeout: null
    }
  }

  public deleteRoom(roomId: string): void {
    delete this._states[roomId]
  }

  public startGame(roomId: string, gameList: AqSong[]): void {
    this._states[roomId].gameList = gameList
    this._states[roomId].playing = true
    this._states[roomId].currentSongCount = 0
  }

  public stopGame(roomId: string): void {
    this._states[roomId].playing = false
  }

  public getGameState(roomId: string): AqGameState {
    const state = this._states[roomId]
    return {
      currentSongCount: state.currentSongCount,
      maxSongCount: state.gameList.length,
      currentSong: state.gameList[state.currentSongCount],
      playing: state.playing
    }
  }

  protected _clearCountdown(roomId: string): void {
    clearInterval(this._states[roomId].countdown)
  }

  public async waitPlayerLoaded(duration: number, roomId: string): Promise<void> {
    const tick = 500
    this._clearCountdown(roomId)
    let time = 0
    return new Promise((resolve) => {
      time += tick
      this._states[roomId].countdown = setInterval(() => {
        if (time >= duration || this._io.isLoaded(roomId)) {
          resolve()
        }
      }, tick)
    })
  }
}

export {
  GameStates
}
