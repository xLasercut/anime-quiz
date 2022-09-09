import { AbstractEmitter } from './abstract';
import { SHARED_EVENTS } from '../shared/events';
import { IClientData } from '../shared/interfaces';

class SystemEmitter extends AbstractEmitter {
  public systemNotification(color: string, message: string, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.SYSTEM_NOTIFICATION, color, message);
  }

  public updateClientData(clientData: IClientData, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_CLIENT_DATA, clientData);
  }
}

export { SystemEmitter };
