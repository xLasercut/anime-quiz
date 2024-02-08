import {
  ClientDataType,
  GameGuessType,
  GamePlayerLifeLineTypeType,
  GamePlayerType,
  GameRoomIdType,
  GameScoreType,
  NotificationColorType,
  SongIdType
} from '../shared/models/types';
import { DbUserSongType, DbUserType } from '../models/types';
import { ClientData } from '../shared/models/client';
import { Socket } from '../types';
import { GameRoomId } from '../shared/models/game';
import { UnauthorizedError } from './exceptions';
import { Logger } from 'winston';

class SocketData {
  protected _clientData: ClientDataType;
  protected _logger: Logger;
  protected _socket: Socket;
  public clientAuthTimer?: NodeJS.Timeout;
  protected _gameGuess: GameGuessType;
  protected _score: GameScoreType;
  protected _songLoaded: boolean;
  protected _pendingScore: number;
  protected _scoreColor: NotificationColorType;
  protected _skipSong: boolean;
  protected _lifeLine: Record<GamePlayerLifeLineTypeType, boolean>;

  constructor(socket: Socket, logger: Logger) {
    this._logger = logger;
    this._socket = socket;
    this._clientData = {
      userId: '',
      displayName: '',
      discordId: '',
      admin: false,
      avatar: '',
      host: false,
      auth: false,
      socketId: ''
    };
    this._gameGuess = {
      anime: '',
      title: ''
    };
    this._score = 0;
    this._songLoaded = false;
    this._pendingScore = 0;
    this._scoreColor = 'error';
    this._skipSong = false;
    this._lifeLine = {
      ANIME_HINT: true,
      SONG_HINT: true
    };
  }

  public useLifeLine(lifeLineType: GamePlayerLifeLineTypeType): boolean {
    if (this._lifeLine[lifeLineType]) {
      this._lifeLine[lifeLineType] = false;
      return true;
    }
    return false;
  }

  public get skipSong(): boolean {
    return this._skipSong;
  }

  public set skipSong(skipSong: boolean) {
    this._skipSong = skipSong;
  }

  public get clientData(): ClientDataType {
    return this._clientData;
  }

  public get playerData(): GamePlayerType {
    return {
      ...this._clientData,
      guess: this._gameGuess,
      score: this._score,
      scoreColor: this._scoreColor,
      skipSong: this._skipSong
    };
  }

  public get songLoaded(): boolean {
    return this._songLoaded;
  }

  public set songLoaded(songLoaded: boolean) {
    this._songLoaded = songLoaded;
  }

  public set gameGuess(gameGuess: GameGuessType) {
    this._gameGuess = gameGuess;
  }

  public set pendingScore(pendingScore: number) {
    this._pendingScore = pendingScore;
  }

  public get currentGameRoom(): GameRoomIdType {
    const allRooms = Array.from(this._socket.rooms);
    const gameRooms = allRooms.filter((roomId: string) => {
      try {
        GameRoomId.parse(roomId);
        return true;
      } catch {}
    });

    if (gameRooms.length !== 1) {
      this._logger.warn('user game room error', {
        allRooms: allRooms,
        clientData: this.clientData
      });
      throw new UnauthorizedError();
    }

    return gameRooms[0];
  }

  public newGame(): void {
    this._score = 0;
    this._lifeLine = {
      ANIME_HINT: true,
      SONG_HINT: true
    };
  }

  public updateUserSettings(clientData: ClientDataType): void {
    this._clientData.avatar = clientData.avatar;
    this._clientData.displayName = clientData.displayName;
  }

  public initClientData(dbUser: DbUserType): void {
    this._clientData = ClientData.parse({
      userId: dbUser.user_id,
      displayName: dbUser.display_name,
      discordId: dbUser.discord_id,
      admin: dbUser.admin,
      avatar: dbUser.avatar,
      host: false,
      auth: true,
      socketId: this._socket.id
    });
  }

  public generateDbUserSongs(songIds: SongIdType[]): DbUserSongType {
    return {
      user_id: this._clientData.userId,
      song_id: songIds
    };
  }

  public setHost(host: boolean) {
    this._clientData.host = host;
  }

  public updateScore() {
    this._score += this._pendingScore;
    this._scoreColor = this._getScoreColor();
  }

  public newRound() {
    this._songLoaded = false;
    this._pendingScore = 0;
    this._scoreColor = 'error';
    this._gameGuess = {
      anime: '',
      title: ''
    };
    this._skipSong = false;
  }

  protected _getScoreColor(): NotificationColorType {
    if (this._pendingScore >= 2) {
      return 'success';
    }

    if (this._pendingScore >= 1) {
      return 'warning';
    }

    return 'error';
  }
}

export { SocketData };
