import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbAllowedUser, DbUser } from '../models/user';
import { DbUserType } from '../models/types';
import { UnauthorizedError } from '../app/exceptions';

class UserDb extends AbstractDb {
  protected _allowedUsers: string[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath);
    this.reloadCache();
  }

  public reloadCache() {
    this._allowedUsers = this._getAllowedUsers();
  }

  public getUserInfo(discordId: string): DbUserType {
    this._validateAllowedUser(discordId);
    const statement = this._db.prepare(`
      SELECT 
        *
      FROM users 
      WHERE discord_id = ?
    `);
    const response = statement.get(discordId);
    return DbUser.parse(response);
  }

  protected _validateAllowedUser(discordId: string) {
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
