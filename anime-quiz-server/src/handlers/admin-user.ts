import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { UserType } from '../shared/models/types';
import { UnauthorizedError } from '../app/exceptions';
import { User } from '../shared/models/user';
import { LOG_REFERENCES } from '../app/logging/constants';

class AdminUserHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_USER]: (_user: UserType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_USER, {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteToDb();
      const user = User.parse(_user);
      this._userDb.validateUserNotExists(user);
      this._userDb.newUser(user);
      this._emitter.updateStoreUserList(this._userDb.getUserList());
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} added`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_USER]: (_user: UserType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_USER, {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteToDb();
      const user = User.parse(_user);
      this._userDb.validateUserExists(user);
      this._userDb.deleteUser(user);
      this._userDb.deleteAllUserSongs(user);
      this._emitter.updateStoreUserList(this._userDb.getUserList());
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} deleted`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_USER]: (_user: UserType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_USER, {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteToDb();
      const user = User.parse(_user);
      this._userDb.validateUserExists(user);
      this._userDb.editUser(user);
      this._emitter.updateStoreUserList(this._userDb.getUserList());
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} edited`
        },
        this._socket.id
      );
      callback(true);
    }
  };

  protected _validateIsAdmin(): void {
    if (!this._socket.data.clientData.admin) {
      throw new UnauthorizedError();
    }
  }

  protected _validateCanWriteToDb(): void {
    this._validateIsAdmin();
    this._userDb.validateDbNotLocked();
  }
}

export { AdminUserHandler };
