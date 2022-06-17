import { AbstractEmitter } from './abstract';
import { Server } from '../app/server';
import { AnimeQuizUserDb } from '../database/user';
import { SHARED_EVENTS } from '../shared/events';

class UserDbEmitter extends AbstractEmitter {
  protected _userDb: AnimeQuizUserDb;

  constructor(io: Server, userDb: AnimeQuizUserDb) {
    super(io);
    this._userDb = userDb;
  }

  public updateUserLists(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_USER_LISTS, this._userDb.getUserLists());
  }
}

export { UserDbEmitter };
