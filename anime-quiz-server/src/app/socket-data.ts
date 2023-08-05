import {ClientDataType, SongIdType} from '../shared/models/types';
import {DbUserSongType, DbUserType} from '../models/types';
import { ClientData } from '../shared/models/client';

class SocketData {
  protected _clientData: ClientDataType;
  public clientAuthTimer?: NodeJS.Timeout;

  constructor() {
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
    }
  }
}

export { SocketData };
