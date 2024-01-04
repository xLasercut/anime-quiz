import { GameGuessType, GameRoomIdType, GameRoomStateType, SongType } from '../shared/models/types';
import { Server } from '../app/server';
import { clearInterval, clearTimeout } from 'node:timers';
import { Socket } from '../types';
import { SongListEmptyError } from '../app/exceptions';

class GameState {
  protected _currentSong: SongType = {
    songId: '',
    src: '',
    type: 'OP',
    songTitle: '',
    artist: '',
    animeName: [],
    animeId: []
  };
  protected _currentSongCount: number = 0;
  protected _maxSongCount: number = 0;
  protected _gameSongList: SongType[] = [];
  protected _playing: boolean = false;
  protected _timeout?: NodeJS.Timeout;
  protected _timer?: NodeJS.Timeout;
  protected _io: Server;
  protected _roomId: GameRoomIdType;

  constructor(io: Server, roomId: GameRoomIdType) {
    this._io = io;
    this._roomId = roomId;
  }

  public get dict(): GameRoomStateType {
    return {
      currentSong: this._currentSong,
      currentSongCount: this._currentSongCount + 1,
      maxSongCount: this._maxSongCount,
      playing: this._playing
    };
  }

  public newGame(songList: SongType[]) {
    if (songList.length <= 0) {
      throw new SongListEmptyError();
    }
    this._gameSongList = songList;
    this._maxSongCount = songList.length;
    this._currentSongCount = 0;
    this._currentSong = this._getCurrentSong();
    this._playing = true;
  }

  public stopGame() {
    this._clearCountdown();
    this._clearTimeout();
    this._playing = false;
  }

  public newRound() {
    const socketIds = this._io.sockets.adapter.rooms.get(this._roomId) || new Set();
    for (const socketId of Array.from(socketIds)) {
      this._io.sockets.sockets.get(socketId)?.data.newRound();
    }
  }

  public nextSong() {
    this._currentSongCount += 1;
    this._currentSong = this._getCurrentSong();
  }

  public calculateScore(gameGuess: GameGuessType): number {
    let score = 0;
    if (gameGuess.title && gameGuess.title.toLowerCase() === this._currentSong.songTitle.toLowerCase()) {
      score += 1;
    }

    for (const animeName of this._currentSong.animeName) {
      if (gameGuess.anime && gameGuess.anime.toLowerCase() === animeName.toLowerCase()) {
        score += 1;
        break;
      }
    }

    return score;
  }

  public async startTimeout(duration: number): Promise<void> {
    this._clearTimeout();
    return new Promise((resolve) => {
      this._timeout = setTimeout(() => {
        this._clearTimeout();
        resolve();
      }, duration);
    });
  }

  public async waitPlayerLoaded(duration: number): Promise<void> {
    const tick = 500;
    this._clearCountdown();
    let time = 0;
    return new Promise((resolve) => {
      this._timer = setInterval(() => {
        if (time >= duration || this._playerLoaded()) {
          this._clearCountdown();
          resolve();
        }
        time += tick;
      }, tick);
    });
  }

  protected _playerLoaded(): boolean {
    const socketIds = this._io.sockets.adapter.rooms.get(this._roomId) || new Set();
    for (const socketId of Array.from(socketIds)) {
      const socket = this._io.sockets.sockets.get(socketId) as Socket;
      if (!socket.data.songLoaded) {
        return false;
      }
    }
    return true;
  }

  protected _getCurrentSong(): SongType {
    return (
      this._gameSongList[this._currentSongCount] || {
        songId: '',
        src: '',
        type: 'OP',
        songTitle: '',
        artist: '',
        animeName: [],
        animeId: []
      }
    );
  }

  protected _clearTimeout(): void {
    clearTimeout(this._timeout);
  }

  protected _clearCountdown(): void {
    clearInterval(this._timer);
  }

  public updateScore() {
    const socketIds = this._io.sockets.adapter.rooms.get(this._roomId) || new Set();
    for (const socketId of Array.from(socketIds)) {
      this._io.sockets.sockets.get(socketId)?.data.updateScore();
    }
  }

  public isLastSong(): boolean {
    return this._currentSongCount >= this._gameSongList.length - 1;
  }
}

export { GameState };
