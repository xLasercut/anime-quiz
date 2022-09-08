import { Logger } from '../app/logging/logger';
import { IGameStateRaw } from '../interfaces';
import { IGameGuess, IGameState, ISong } from '../shared/interfaces';
import { Server } from '../app/server';
import { OP } from '../shared/constants/song-types';

class GameStatesDb {
  protected _logger: Logger;
  protected _states: { [key: string]: IGameStateRaw };
  protected _io: Server;

  constructor(logger: Logger, io: Server) {
    this._logger = logger;
    this._io = io;
    this._states = {};
  }

  public songOverride(song: ISong, roomId: string): void {
    this._states[roomId].songOverride = song;
  }

  public addRoom(roomId: string): void {
    this._states[roomId] = {
      playing: false,
      currentSongCount: 0,
      startPosition: 0,
      gameList: [],
      songOverride: null,
      countdown: null,
      timeout: null,
      currentSong: {
        anime_name: [],
        anime_id: [],
        song_id: '',
        type: OP,
        artist: '',
        song_title: '',
        src: ''
      }
    };
  }

  public nextSong(roomId: string): void {
    this._states[roomId].currentSongCount += 1;
    this._states[roomId].currentSong = this._getCurrentSong(roomId);
  }

  public clearSongOverride(roomId: string): void {
    this._states[roomId].songOverride = null;
  }

  public isLastSong(roomId: string): boolean {
    const state = this._states[roomId];
    return state.currentSongCount >= state.gameList.length - 1;
  }

  public deleteRoom(roomId: string): void {
    this._clearCountdown(roomId);
    this._clearTimeout(roomId);
    delete this._states[roomId];
  }

  public startGame(roomId: string, gameList: ISong[]): void {
    this._states[roomId].gameList = gameList;
    this._states[roomId].playing = true;
    this._states[roomId].currentSongCount = 0;
    this._states[roomId].songOverride = null;
    this._states[roomId].currentSong = this._getCurrentSong(roomId);
  }

  public stopGame(roomId: string): void {
    this._clearCountdown(roomId);
    this._clearTimeout(roomId);
    this._states[roomId].playing = false;
  }

  public getGameState(roomId: string): IGameState {
    const state = this._states[roomId];
    return {
      currentSongCount: state.currentSongCount + 1,
      maxSongCount: state.gameList.length,
      currentSong: state.currentSong,
      playing: state.playing
    };
  }

  public calculateScore(guess: IGameGuess, roomId: string): number {
    const currentSong = this._states[roomId].currentSong;
    let score = 0;
    if (guess.title && guess.title.toLowerCase() === currentSong.song_title.toLowerCase()) {
      score += 1;
    }

    for (const anime of currentSong.anime_name) {
      if (guess.anime && guess.anime.toLowerCase() === anime.toLowerCase()) {
        score += 1;
        break;
      }
    }

    return score;
  }

  protected _getCurrentSong(roomId: string): ISong {
    const state = this._states[roomId];
    if (state.songOverride) {
      return state.songOverride;
    }
    return (
      state.gameList[state.currentSongCount] || {
        anime_name: [],
        anime_id: [],
        song_id: '',
        type: OP,
        artist: '',
        song_title: '',
        src: ''
      }
    );
  }

  protected _clearCountdown(roomId: string): void {
    clearInterval(this._states[roomId].countdown);
  }

  protected _clearTimeout(roomId: string): void {
    clearTimeout(this._states[roomId].timeout);
  }

  public async waitPlayerLoaded(duration: number, roomId: string): Promise<void> {
    const tick = 500;
    this._clearCountdown(roomId);
    let time = 0;
    return new Promise((resolve) => {
      this._states[roomId].countdown = setInterval(() => {
        if (time >= duration || this._io.isLoaded(roomId)) {
          this._clearCountdown(roomId);
          resolve();
        }
        time += tick;
      }, tick);
    });
  }

  public async startTimeout(duration: number, roomId: string): Promise<void> {
    this._clearTimeout(roomId);
    return new Promise((resolve) => {
      this._states[roomId].timeout = setTimeout(() => {
        this._clearTimeout(roomId);
        resolve();
      }, duration);
    });
  }
}

export { GameStatesDb };
