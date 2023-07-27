import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { ClientDataType } from '../shared/models/types';
import { ClientData } from '../shared/models/client';

class UserHandler extends AbstractHandler {
  public start() {
    this._socket.on(
      SOCKET_EVENTS.UPDATE_USER_SETTINGS,
      this._errHandler((_clientData: ClientDataType) => {
        const clientData = ClientData.parse(_clientData);
        this._userDb.validateAllowedUser(this._socket.data.clientData.discordId);
        this._userDb.updateUserSettings(clientData, this._socket.data.clientData.discordId);
        this._socket.data.updateUserSettings(clientData);
        this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
        this._emitter.systemNotification(
          { color: 'success', message: 'Updated user settings' },
          this._socket.id
        );
      })
    );
  }
}

export { UserHandler };
