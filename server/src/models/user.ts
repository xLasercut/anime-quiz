import { AbstractModel } from './abstract';
import { IUserSongs, IUserSongsRaw } from '../shared/interfaces';
import { userRawSchema, userSchema } from '../schemas/user';
import { v4 } from 'uuid';

class NewUser extends AbstractModel<IUserSongs> {
  constructor(_user: IUserSongs) {
    const { user_id, ...rest } = _user;
    const user = new User({ ...rest, user_id: `user-${v4()}` }).dict();
    super(userSchema, user);
  }
}

class User extends AbstractModel<IUserSongs> {
  constructor(user: IUserSongs) {
    super(userSchema, user);
  }
}

class UserRaw extends AbstractModel<IUserSongsRaw> {
  constructor(user: IUserSongsRaw) {
    super(userRawSchema, user);
  }

  public toUser(): User {
    const { song_id, ...rest } = this._result.value;
    const user = {
      ...rest,
      song_id: this._jsonParseList(song_id)
    };
    return new User(user);
  }
}

export { User, NewUser, UserRaw };
