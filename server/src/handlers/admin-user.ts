import { ServerHandler } from './common';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TUser } from 'anime-quiz-shared-resources/src/models/types';
import { User } from 'anime-quiz-shared-resources/src/models/user';

class AdminUserHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_USER]: (_user: TUser, callback: Function) => {
      this._logger.info('admin add user', {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteDbAdmin();
      const user = User.parse(_user);
      this._userDb.validateRecordNotExists(user);
      this._userDb.newRecord(user);
      this._emitter.updateStoreUserList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} added`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_USER]: (_user: TUser, callback: Function) => {
      this._logger.info('admin delete user', {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteDbAdmin();
      const user = User.parse(_user);
      this._userDb.validateRecordExists(user);
      this._userDb.deleteRecord(user);
      this._emitter.updateStoreUserList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} deleted`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_USER]: (_user: TUser, callback: Function) => {
      this._logger.info('admin edit user', {
        clientData: this._socket.data.clientData,
        request: _user
      });
      this._validateCanWriteDbAdmin();
      const user = User.parse(_user);
      this._userDb.validateRecordExists(user);
      this._userDb.editRecord(user);
      this._emitter.updateStoreUserList();
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
}

export { AdminUserHandler };
