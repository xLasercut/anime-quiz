import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbAllowedUser, DbUser, DbUserSongList } from '../models/user';
import { DbUserType } from '../models/types';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import {
  ClientDataType,
  DiscordIdType,
  SongIdType,
  UserIdType,
  UserType
} from '../shared/models/types';
import { LOG_REFERENCES } from '../app/logging/constants';
import { User } from '../shared/models/user';

class UserDb extends AbstractDb {
  protected _allowedUsers: DiscordIdType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath);
    this.reloadCache();
  }

  public getUserList(): UserType[] {
    const statement = this._db.prepare(`
      SELECT
        *
      FROM users
    `);
    const response = statement.all();
    this._logger.writeLog(LOG_REFERENCES.FETCHED_USER_LIST, { response: response });
    const dbUserList = response.map((item) => DbUser.parse(item));
    return dbUserList.map((dbUser): UserType => {
      const user: UserType = {
        discordId: dbUser.discord_id,
        userId: dbUser.user_id,
        admin: dbUser.admin,
        avatar: dbUser.avatar,
        displayName: dbUser.display_name
      };
      return User.parse(user);
    });
  }

  public getUserSongList(discordId: DiscordIdType): SongIdType[] {
    const statement = this._db.prepare(`
      SELECT
        discord_id,
        users.user_id,
        display_name,
        avatar,
        admin,
        json_group_array(song_id) AS song_id
      FROM users
        LEFT JOIN user_songs
        ON users.user_id = user_songs.user_id
      WHERE discord_id = ?
      GROUP BY users.user_id
    `);
    const response = statement.get(discordId);
    this._logger.writeLog(LOG_REFERENCES.FETCHED_USER_SONG_LIST, {
      response: response
    });
    if (!response) {
      return [];
    }
    const dbUserSongList = DbUserSongList.parse(response);
    return dbUserSongList.song_id;
  }

  public reloadCache() {
    this._allowedUsers = this._getAllowedUsers();
  }

  public getUserInfo(discordId: DiscordIdType): DbUserType {
    const statement = this._db.prepare(`
      SELECT 
        *
      FROM users 
      WHERE discord_id = ?
    `);
    const response = statement.get(discordId);
    return DbUser.parse(response);
  }

  public updateUserSettings(clientData: ClientDataType, discordId: DiscordIdType): void {
    const statement = this._db.prepare(`
      UPDATE users
      SET
        display_name = ?,
        avatar = ?
      WHERE discord_id = ?
    `);
    statement.run([clientData.displayName, clientData.avatar, discordId]);
  }

  public validateAllowedUser(discordId: DiscordIdType): void {
    if (!this._allowedUsers.includes(discordId)) {
      throw new UnauthorizedError();
    }
  }

  public validateUserNotExists(userId: UserIdType, discordId: DiscordIdType): void {
    const statement = this._db.prepare(`
      SELECT
        *
      FROM users
      WHERE user_id = ? OR discord_id = ?
    `);
    const response = statement.get([userId, discordId]);
    if (response) {
      throw new DataQualityError('User already exists');
    }
  }

  public newUser(user: UserType): void {
    const statement = this._db.prepare(`
      INSERT INTO users (discord_id, user_id, display_name, avatar, admin) VALUES (?,?,?,?,?)
    `);
    statement.run([user.discordId, user.userId, user.displayName, user.avatar, user.admin ? 1 : 0]);
  }

  protected _getAllowedUsers(): string[] {
    const statement = this._db.prepare(`
      SELECT
        discord_id
      FROM users
    `);
    const response = statement.all();
    return response.map((item) => {
      return DbAllowedUser.parse(item).discord_id;
    });
  }
}

export { UserDb };
