import { ServerDb, userDbConnection } from './common';
import { ServerConfig } from '../interfaces';
import { DbUser } from '../models/user';
import { DbUserType } from '../models/types';
import { DataQualityError, UnauthorizedError } from '../app/exceptions';
import { ClientDataType, DiscordIdType, UserIdType, UserType } from '../shared/models/types';
import { User } from '../shared/models/user';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { Logger } from '../app/logger';

const STATEMENTS = {
  SELECT_ALL_USER: 'SELECT_ALL_USER',
  INSERT_USER: 'INSERT_USER',
  EDIT_USER: 'EDIT_USER',
  DELETE_USER: 'DELETE_USER',
  SELECT_USER_BY_ANY_IDS: 'SELECT_USER_BY_ANY_IDS',
  DELETE_USER_SONGS_BY_USER_ID: 'DELETE_USER_SONGS_BY_USER_ID',
  EDIT_USER_SETTINGS: 'EDIT_USER_SETTINGS',
  SELECT_USER_BY_DISCORD_ID: 'SELECT_USER_BY_DISCORD_ID'
};

const RAW_STATEMENTS = {
  [STATEMENTS.SELECT_ALL_USER]: `
    SELECT
      *
    FROM users
  `,
  [STATEMENTS.INSERT_USER]: `
    INSERT INTO users 
      (discord_id, user_id, display_name, avatar, admin) 
    VALUES 
      (@discordId, @userId, @displayName, @avatar, ?)
  `,
  [STATEMENTS.EDIT_USER]: `
    UPDATE users
    SET
      display_name = @displayName,
      avatar = @avatar,
      admin = ?
    WHERE discord_id = @discordId AND user_id = @userId
  `,
  [STATEMENTS.DELETE_USER]: `
    DELETE FROM users 
    WHERE discord_id = @discordId AND user_id = @userId
  `,
  [STATEMENTS.SELECT_USER_BY_ANY_IDS]: `
    SELECT
      *
    FROM users
    WHERE user_id = @userId OR discord_id = @discordId
  `,
  [STATEMENTS.DELETE_USER_SONGS_BY_USER_ID]: `
    DELETE FROM user_songs 
    WHERE user_id = @userId
  `,
  [STATEMENTS.EDIT_USER_SETTINGS]: `
    UPDATE users
    SET
      display_name = @displayName,
      avatar = @avatar
    WHERE user_id = ?
  `,
  [STATEMENTS.SELECT_USER_BY_DISCORD_ID]: `
    SELECT 
      *
    FROM users 
    WHERE discord_id = ?
  `
};

class UserDb extends ServerDb<UserType> {
  protected _db: SqliteDb;
  protected _factory: StatementFactory;
  protected _allowedUsers: DiscordIdType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(config, logger);
    this._db = userDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public getUserList(): UserType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_USER);
    const response = statement.all();
    this._logger.debug('fetched user list', { response: response });
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

  public getUserInfo(discordId: DiscordIdType): DbUserType {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_USER_BY_DISCORD_ID);
    const response = statement.get(discordId);
    this._logger.debug('fetched user info', { response: response, discordId: discordId });
    return DbUser.parse(response);
  }

  public updateUserSettings(clientData: ClientDataType, userId: UserIdType): void {
    const statement = this._factory.getStatement(STATEMENTS.EDIT_USER_SETTINGS);
    statement.run(userId, clientData);
  }

  public validateAllowedUser(discordId: DiscordIdType): void {
    if (!this._allowedUsers.includes(discordId)) {
      throw new UnauthorizedError();
    }
  }

  public validateRecordNotExists(user: UserType): void {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_USER_BY_ANY_IDS);
    const response = statement.get(user);
    if (response) {
      throw new DataQualityError('User already exists');
    }
  }

  public validateRecordExists(record: UserType): void {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_USER_BY_ANY_IDS);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('User does not exist');
    }
  }

  public newRecord(record: UserType) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_USER);
    statement.run(record.admin ? 1 : 0, record);
    this.reloadCache();
  }

  public deleteRecord(record: UserType) {
    const deleteUserStatement = this._factory.getStatement(STATEMENTS.DELETE_USER);
    deleteUserStatement.run(record);
    const deleteUserSongStatement = this._factory.getStatement(STATEMENTS.DELETE_USER_SONGS_BY_USER_ID);
    deleteUserSongStatement.run(record);
    this.reloadCache();
  }

  public editRecord(record: UserType) {
    const statement = this._factory.getStatement(STATEMENTS.EDIT_USER);
    statement.run(record.admin ? 1 : 0, record);
    this.reloadCache();
  }

  protected _getAllowedUsers(): DiscordIdType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_USER);
    const response = statement.all();
    return response.map((item: any) => DbUser.parse(item).discord_id);
  }

  public reloadDb() {
    this._db = userDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._allowedUsers = this._getAllowedUsers();
  }
}

export { UserDb };
