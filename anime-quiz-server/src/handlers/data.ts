import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class DataHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.UPDATE_STORE_USER_LIST]: () => {
      this._emitter.updateStoreUserList(this._userDb.getUserList(), this._socket.id);
    }
  };
}

export { DataHandler };
