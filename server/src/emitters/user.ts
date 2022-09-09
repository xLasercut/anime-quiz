import { AbstractEmitter } from './abstract';
import { Server } from '../app/server';
import { UserDb } from '../database/user';
import { SHARED_EVENTS } from '../shared/events';

class UserDbEmitter extends AbstractEmitter {
  protected _userDb: UserDb;

  constructor(io: Server, userDb: UserDb) {
    super(io);
    this._userDb = userDb;
  }

  public updateUserLists(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_USER_LISTS, this._userDb.getUserLists());
  }
}

export { UserDbEmitter };
