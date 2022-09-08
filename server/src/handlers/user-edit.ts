import { AbstractHandler } from './abstract';
import { UserDb } from '../database/user';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { UserDbEmitter } from '../emitters/user';
import { SystemEmitter } from '../emitters/system';
import { IUserSongs } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { NewUser, User } from '../models/user';
import { Server } from '../app/server';
import { SUCCESS } from '../shared/constants/colors';

class UserEditHandler extends AbstractHandler {
  protected _userDb: UserDb;
  protected _userDbEmitter: UserDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(io: Server, logger: Logger, userDb: UserDb) {
    super(logger);
    this._userDb = userDb;
    this._userDbEmitter = new UserDbEmitter(io, userDb);
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_USER_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.USER_EDIT);
        this._userDbEmitter.updateUserLists(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_USER, (_user: IUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: _user, type: 'add' });
        this._validateIsAdmin(socket);
        this._userDb.validateDbNotLocked();
        const user = new NewUser(_user).dict();
        this._userDb.validateUsernameNotExist(user.username);
        this._userDb.newUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(SUCCESS, `Added ${user.username} user`, socket.id);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_USER, (_user: IUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: _user, type: 'edit' });
        this._validateIsAdmin(socket);
        this._userDb.validateDbNotLocked();
        const user = new User(_user).dict();
        this._userDb.validateUserExist(user.user_id);
        this._userDb.validateUsernameNotExist(user.username);
        this._userDb.editUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(SUCCESS, `Edited ${user.username} user`, socket.id);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_USER, (_user: IUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: _user, type: 'delete' });
        this._validateIsAdmin(socket);
        this._userDb.validateDbNotLocked();
        const user = new User(_user).dict();
        this._userDb.validateUserExist(user.user_id);
        this._userDb.deleteUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(SUCCESS, `Deleted ${user.username} user`, socket.id);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });
  }
}

export { UserEditHandler };
