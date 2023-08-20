import { ClientDataType, GameRoomIdType, SongIdType } from '../shared/models/types';
import { DbUserSongType, DbUserType } from '../models/types';
import { ClientData } from '../shared/models/client';
import { Socket } from '../types';
import { GameRoomId } from '../shared/models/game';
import { Logger } from './logger';
import { all } from 'axios';
import { UnauthorizedError } from './exceptions';

class SocketData {
  protected _clientData: ClientDataType;
  protected _logger: Logger;
  protected _socket: Socket;
  public clientAuthTimer?: NodeJS.Timeout;

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
      auth: false
    };
  }

  public get clientData(): ClientDataType {
    return this._clientData;
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
      auth: true
    });
  }

  public generateDbUserSongs(songIds: SongIdType[]): DbUserSongType {
    return {
      user_id: this._clientData.userId,
      song_id: songIds
    };
  }
}

export { SocketData };
