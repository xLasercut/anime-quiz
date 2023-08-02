import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { UserType } from '../shared/models/types';
import { UnauthorizedError } from '../app/exceptions';
import { User } from '../shared/models/user';

class AdminUserHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_USER]: (_user: UserType, callback: Function) => {
      this._validateIsAdmin();
      const user = User.parse(_user);
      this._userDb.validateUserNotExists(user.userId, user.discordId);
      this._userDb.newUser(user);
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `User ${user.discordId} - ${user.displayName} added`
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
}

export { AdminUserHandler };
