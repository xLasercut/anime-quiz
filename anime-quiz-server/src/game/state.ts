import { Logger } from '../app/logging/logger'
import { AqGameStateRaw } from '../interfaces'
import { AqGameGuess, AqGameState, AqSong } from '../shared/interfaces'
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

  public nextSong(roomId: string): void {
    this._states[roomId].currentSongCount += 1
  }

  public isLastSong(roomId: string): boolean {
    const state = this._states[roomId]
    return state.currentSongCount >= (state.gameList.length - 1)
  }

  public deleteRoom(roomId: string): void {
    this._clearCountdown(roomId)
    this._clearTimeout(roomId)
    delete this._states[roomId]
  }

  public startGame(roomId: string, gameList: AqSong[]): void {
    this._states[roomId].gameList = gameList
    this._states[roomId].playing = true
    this._states[roomId].currentSongCount = 0
  }

  public stopGame(roomId: string): void {
    this._clearCountdown(roomId)
    this._clearTimeout(roomId)
    this._states[roomId].playing = false
  }

  public getGameState(roomId: string): AqGameState {
    const state = this._states[roomId]
    return {
      currentSongCount: state.currentSongCount,
      maxSongCount: state.gameList.length,
      currentSong: this._getCurrentSong(roomId),
      playing: state.playing
    }
  }

  public calculateScore(guess: AqGameGuess, roomId: string): number {
    const currentSong = this._getCurrentSong(roomId)
    let score = 0
    if (guess.title.toLowerCase() === currentSong.song_title.toLowerCase()) {
      score += 1
    }

    for (const anime of currentSong.anime_name) {
      if (anime.toLowerCase() === guess.anime.toLowerCase()) {
        score += 1
      }
    }

    return score
  }

  protected _getCurrentSong(roomId: string): AqSong {
    const state = this._states[roomId]
    return state.gameList[state.currentSongCount]
  }

  protected _clearCountdown(roomId: string): void {
    clearInterval(this._states[roomId].countdown)
  }

  protected _clearTimeout(roomId: string): void {
    clearTimeout(this._states[roomId].timeout)
  }

  public async waitPlayerLoaded(duration: number, roomId: string): Promise<void> {
    const tick = 500
    this._clearCountdown(roomId)
    let time = 0
    return new Promise((resolve) => {
      time += tick
      this._states[roomId].countdown = setInterval(() => {
        if (time >= duration || this._io.isLoaded(roomId)) {
          this._clearCountdown(roomId)
          resolve()
        }
      }, tick)
    })
  }

  public async startTimeout(duration: number, roomId: string): Promise<void> {
    this._clearTimeout(roomId)
    return new Promise((resolve) => {
      this._states[roomId].timeout = setTimeout(() => {
        this._clearTimeout(roomId)
        resolve()
      }, duration)
    })
  }
}

export {
  GameStates
}
