import {
  IClientData,
  IGameAvatar,
  IGameGuess,
  IGameLoginData,
  IGamePlayer,
  INotificationColor
} from '../shared/interfaces';
import { EVA_UNIT_1 } from '../shared/constants/avatars';
import { ERROR, SUCCESS, WARNING } from '../shared/constants/colors';

class SocketData {
  public auth: boolean;
  public admin: boolean;
  public username: string;
  public avatar: IGameAvatar;
  protected _id: string;
  public clientAuthTimer: NodeJS.Timeout;
  public host: boolean;
  public score: number;
  public gameGuess: IGameGuess;
  public songLoaded: boolean;
  public pendingScore: number;
  public scoreColor: INotificationColor;

  constructor(id: string) {
    this.auth = false;
    this.admin = false;
    this.host = false;
    this._id = id;
    this.username = '';
    this.avatar = EVA_UNIT_1;
    this.score = 0;
    this.scoreColor = ERROR;
    this.gameGuess = {
      anime: '',
      title: ''
    };
    this.songLoaded = false;
    this.pendingScore = 0;
  }

  public userLogin(loginData: IGameLoginData): void {
    this.username = loginData.username;
    this.avatar = loginData.avatar;
  }

  public getClientData(): IClientData {
    return {
      username: this.username,
      avatar: this.avatar,
      admin: this.admin,
      host: this.host
    };
  }

  public getPlayerData(): IGamePlayer {
    return {
      username: this.username,
      avatar: this.avatar,
      admin: this.admin,
      host: this.host,
      score: this.score,
      guess: this.gameGuess,
      scoreColor: this.scoreColor,
      sid: this._id
    };
  }

  public newRound(): void {
    this.songLoaded = false;
    this.gameGuess = {
      anime: '',
      title: ''
    };
    this.pendingScore = 0;
    this.scoreColor = ERROR;
  }

  public updateScore(): void {
    this.score += this.pendingScore;
    this.scoreColor = this._getScoreColor();
  }

  protected _getScoreColor(): INotificationColor {
    if (this.pendingScore >= 2) {
      return SUCCESS;
    }

    if (this.pendingScore >= 1) {
      return WARNING;
    }

    return ERROR;
  }
}

export { SocketData };
