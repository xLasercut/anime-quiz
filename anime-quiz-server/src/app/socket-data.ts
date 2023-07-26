import { ClientDataType } from '../shared/models/types';
import { DbUserType } from '../models/types';
import { ClientData } from '../shared/models/client';

class SocketData {
  protected _clientData: ClientDataType;

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

  public authorizeClient(dbUser: DbUserType) {
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
}

export { SocketData };
