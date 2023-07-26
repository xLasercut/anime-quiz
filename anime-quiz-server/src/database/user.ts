import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbUser } from '../models/user';
import { DbUserType } from '../models/types';

class UserDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath);
  }

  public getUserInfo(discord_id: string): DbUserType {
    const statement = this._db.prepare<string>(`
      SELECT 
        *
      FROM users 
      WHERE discord_id = ?
    `);
    const response = statement.get(discord_id);
    return DbUser.parse(response);
  }
}

export { UserDb };
