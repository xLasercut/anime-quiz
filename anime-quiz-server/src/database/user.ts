import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbAllowedUser, DbUser, DbUserSongList } from '../models/user';
import { DbUserType } from '../models/types';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import { ClientDataType, DiscordIdType, SongIdType, UserIdType, UserType } from '../shared/models/types';
import { LOG_REFERENCES } from '../app/logging/constants';
import { User } from '../shared/models/user';

class UserDb extends AbstractDb {
  protected _allowedUsers: DiscordIdType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(config.userDbPath, logger);
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
        display_name = @displayName,
        avatar = @avatar
      WHERE discord_id = ?
    `);
    statement.run(discordId, clientData);
  }

  public validateAllowedUser(discordId: DiscordIdType): void {
    if (!this._allowedUsers.includes(discordId)) {
      throw new UnauthorizedError();
    }
  }

  public validateUserNotExists(user: UserType): void {
    const statement = this._db.prepare(`
      SELECT
        *
      FROM users
      WHERE user_id = @userId OR discord_id = @discordId
    `);
    const response = statement.get(user);
    if (response) {
      throw new DataQualityError('User already exists');
    }
  }

  public validateUserExists(user: UserType): void {
    const statement = this._db.prepare(`
      SELECT
        *
      FROM users
      WHERE user_id = @userId OR discord_id = @discordId
    `);
    const response = statement.get(user);
    if (!response) {
      throw new DataQualityError('User does not exist');
    }
  }

  public validateUserSongsNotExists(songIds: SongIdType[], userId: UserIdType): void {
    if (songIds.length > 50) {
      throw new DataQualityError('Cannot add more thn 50 songs at a time');
    }

    const statement = this._db.prepare(`
      SELECT
        user_id,
        song_id
      FROM user_songs
      WHERE user_id = ? AND
            song_id IN (${this._questionString(songIds.length)})
    `);
    const response = statement.all(userId, songIds);
    if (response.length > 0) {
      throw new DataQualityError('Songs already exists in list');
    }
  }

  public validateUserSongsExists(songIds: SongIdType[], userId: UserIdType): void {
    if (songIds.length > 50) {
      throw new DataQualityError('Cannot remove more thn 50 songs at a time');
    }
  }

  public newUser(user: UserType): void {
    const statement = this._db.prepare(`
      INSERT INTO users (discord_id, user_id, display_name, avatar, admin) VALUES (@discordId,@userId,@displayName,@avatar,?)
    `);
    statement.run(user.admin ? 1 : 0, user);
  }

  public deleteUser(user: UserType): void {
    const statement = this._db.prepare(`
      DELETE FROM users WHERE discord_id = @discordId AND user_id = @userId
    `);
    statement.run(user);
  }

  public deleteAllUserSongs(user: UserType): void {
    const statement = this._db.prepare(`
      DELETE FROM user_songs WHERE user_id = @userId
    `);
    statement.run(user);
  }

  public editUser(user: UserType): void {
    const statement = this._db.prepare(`
      UPDATE users
      SET
        display_name = @displayName,
        avatar = @avatar,
        admin = ?
      WHERE discord_id = @discordId AND user_id = @userId
    `);
    statement.run(user.admin ? 1 : 0, user);
  }

  public addUserSongs(songIds: SongIdType[], userId: UserIdType): void {
    const statement = this._db.prepare(`
      INSERT INTO user_songs (user_id, song_id) VALUES (?,?)
    `);
    const insertMany = this._db.transaction((_songIds: SongIdType[]) => {
      for (const songId of _songIds) {
        statement.run(userId, songId);
      }
    });
    insertMany(songIds);
  }

  public deleteUserSongs(songIds: SongIdType[], userId: UserIdType): void {
    const statement = this._db.prepare(`
      DELETE FROM user_songs WHERE user_id = ? AND song_id = ?
    `);
    const deleteMany = this._db.transaction((_songIds: SongIdType[]) => {
      for (const songId of _songIds) {
        statement.run(userId, songId);
      }
    });
    deleteMany(songIds);
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
