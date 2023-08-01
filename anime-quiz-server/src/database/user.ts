import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbAllowedUser, DbUser, DbUserSongList } from '../models/user';
import { DbUserType } from '../models/types';
import { UnauthorizedError } from '../app/exceptions';
import { ClientDataType, SongIdType } from '../shared/models/types';
import { LOG_REFERENCES } from '../app/logging/constants';

class UserDb extends AbstractDb {
  protected _allowedUsers: string[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath);
    this.reloadCache();
  }

  public getUserSongList(discordId: string): SongIdType[] {
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

  public getUserInfo(discordId: string): DbUserType {
    const statement = this._db.prepare(`
      SELECT 
        *
      FROM users 
      WHERE discord_id = ?
    `);
    const response = statement.get(discordId);
    return DbUser.parse(response);
  }

  public updateUserSettings(clientData: ClientDataType, discordId: string): void {
    const statement = this._db.prepare(`
      UPDATE users
      SET
        display_name = ?,
        avatar = ?
      WHERE discord_id = ?
    `);
    statement.run([clientData.displayName, clientData.avatar, discordId]);
  }

  public validateAllowedUser(discordId: string): void {
    if (!this._allowedUsers.includes(discordId)) {
      throw new UnauthorizedError();
    }
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
