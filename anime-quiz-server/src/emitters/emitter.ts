import { Server } from '../app/server';
import { SystemNotificationType } from '../shared/models/types';
import { SOCKET_EVENTS } from '../shared/events';

class Emitter {
  protected _io: Server;

  constructor(io: Server) {
    this._io = io;
  }

  public systemNotification(notification: SystemNotificationType, sid?: string) {
    this._client(sid).emit(SOCKET_EVENTS.SYSTEM_NOTIFICATION, notification);
  }

  protected _client(sid?: string) {
    if (sid) {
      return this._io.to(sid).compress(true);
    }
    return this._io.compress(true);
  }
}

export { Emitter };
