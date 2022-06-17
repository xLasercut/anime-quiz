import { AbstractHandler } from './abstract';
import { AnimeQuizUserDb } from '../database/user';
import { Logger } from '../app/logging/logger';
import { Socket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { UserDbEmitter } from '../emitters/user';
import { SystemEmitter } from '../emitters/system';
import { AqUserSongs } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { NOTIFICATION_COLOR } from '../shared/constants';

class UserEditHandler extends AbstractHandler {
  protected _userDb: AnimeQuizUserDb;
  protected _userDbEmitter: UserDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(
    logger: Logger,
    userDb: AnimeQuizUserDb,
    userDbEmitter: UserDbEmitter,
    systemEmitter: SystemEmitter
  ) {
    super(logger);
    this._userDb = userDb;
    this._userDbEmitter = userDbEmitter;
    this._systemEmitter = systemEmitter;
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_USER_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.USER_EDIT);
        this._userDbEmitter.updateUserLists(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_USER, (user: AqUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: user, type: 'add' });
        this._validateIsAdmin(socket);
        this._userDb.validateIsDbLocked();
        this._userDb.validateUsernameNotExist(user.username);
        this._userDb.newUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Added ${user.username} user`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_USER, (user: AqUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: user, type: 'edit' });
        this._validateIsAdmin(socket);
        this._userDb.validateIsDbLocked();
        this._userDb.validateUserExist(user.user_id);
        this._userDb.validateUsernameNotExist(user.username);
        this._userDb.editUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Edited ${user.username} user`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_USER, (user: AqUserSongs, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_USER_EDIT, { user: user, type: 'delete' });
        this._validateIsAdmin(socket);
        this._userDb.validateIsDbLocked();
        this._userDb.validateUserExist(user.user_id);
        this._userDb.deleteUser(user);
        this._userDbEmitter.updateUserLists(ROOM_IDS.USER_EDIT);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
          `Deleted ${user.username} user`,
          socket.id
        );
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });
  }
}

export { UserEditHandler };
