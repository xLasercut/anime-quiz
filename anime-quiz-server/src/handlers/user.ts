import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { ClientDataType } from '../shared/models/types';
import { ClientData } from '../shared/models/client';
import { Socket } from '../types';

class UserHandler extends AbstractHandler {
  public start(socket: Socket, errHandler: Function) {
    socket.on(
      SOCKET_EVENTS.UPDATE_USER_SETTINGS,
      errHandler((_clientData: ClientDataType) => {
        const clientData = ClientData.parse(_clientData);
        this._userDb.validateAllowedUser(socket.data.clientData.discordId);
        this._userDb.updateUserSettings(clientData, socket.data.clientData.discordId);
        socket.data.updateUserSettings(clientData);
        this._emitter.updateStoreClientData(socket.data.clientData, socket.id);
        this._emitter.systemNotification(
          { color: 'success', message: 'Updated user settings' },
          socket.id
        );
      })
    );
  }
}

export { UserHandler };
