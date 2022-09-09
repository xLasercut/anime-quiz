import { AbstractDb } from '../abstract';
import { IUserSongs, IUserSongsRaw } from '../../shared/interfaces';
import * as cron from 'node-cron';
import { ServerConfig } from '../../app/config';
import { Logger } from '../../app/logging/logger';
import { LOG_BASE } from '../../app/logging/log-base';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import { GameDataValidationError } from '../../app/exceptions';
import * as Database from 'better-sqlite3';
import { GetListUserSongByUserIdAndSongIds, UserDbStatements } from './sql';
import { UserRaw } from '../../models/user';

class UserDb extends AbstractDb {
  protected _userListsCache: IUserSongs[];
  protected _dbBackupTask: cron.ScheduledTask;
  protected _dataBackupDir: string;
  protected _dataBackupSchedule: string;
  protected _dataBackupCount: number;
  protected _statements: UserDbStatements;

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath);
    this.reloadDb();
    this.reloadCache();
    this._dataBackupDir = config.dataBackupDir;
    this._dataBackupSchedule = config.dbBackupSchedule;
    this._dataBackupCount = config.dbBackupCount;
  }

  public reloadDb(): void {
    this._closeDb();
    this._db = new Database(this._filepath, { fileMustExist: true });
    this._statements = new UserDbStatements(this._db);
  }

  public reloadCache(): void {
    this._userListsCache = this._getUserLists();
  }

  public newUser(user: IUserSongs): void {
    this._statements.insertUser.run([user.user_id, user.username]);
    this.reloadCache();
  }

  public editUser(user: IUserSongs): void {
    this._statements.updateUserById.run([user.username, user.user_id]);
    this.reloadCache();
  }

  public deleteUser(user: IUserSongs): void {
    this._statements.deleteUserById.run([user.user_id]);
    this._statements.deleteUserSongByUserId.run([user.user_id]);
    this.reloadCache();
  }

  public async startBackTask(): Promise<void> {
    this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP, { action: 'enabled task' });
    this._dbBackupTask = cron.schedule(this._dataBackupSchedule, async () => {
      try {
        this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP, { action: 'starting' });
        await this._backupDatabase();
        this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP, { action: 'finished' });
      } catch (e) {
        this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP_FAILED, { error: e.stack });
      }
    });
  }

  protected async _backupDatabase(): Promise<void> {
    if (!fs.existsSync(this._dataBackupDir)) {
      fs.mkdirSync(this._dataBackupDir);
    }
    const filename = `backup-${moment().format('YYYY-MM-DD-HH-mm-ss')}-anime-quiz-user.db`;
    this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP, {
      action: 'create backup',
      filename: filename
    });
    await this._db.backup(path.join(this._dataBackupDir, filename));
    const files = fs.readdirSync(this._dataBackupDir);
    if (files.length > this._dataBackupCount) {
      this._logger.writeLog(LOG_BASE.USER_DATA_BACKUP, {
        action: 'delete old file',
        filename: files[0]
      });
      fs.unlinkSync(path.join(this._dataBackupDir, files[0]));
    }
  }

  protected _getUserLists(): IUserSongs[] {
    const userLists: IUserSongsRaw[] = this._statements.getAllUser.all();
    return userLists.map((user) => {
      return new UserRaw(user).toUser().dict();
    });
  }

  public getUserLists(): IUserSongs[] {
    return this._userListsCache;
  }

  public getSelectedUserLists(userIds: string[]): IUserSongs[] {
    return this._userListsCache.filter((userList) => {
      return userIds.includes(userList.user_id);
    });
  }

  public getSelectedUserSongIds(userIds: string[]): string[] {
    return Array.from(
      new Set(
        this._userListsCache
          .filter((userList) => {
            return userIds.includes(userList.user_id);
          })
          .map((userList) => {
            return userList.song_id;
          })
          .flat(1)
      )
    );
  }

  public addSongs(userId: string, songIds: string[]): void {
    const insertMany = this._db.transaction((_songIds: string[]) => {
      for (const songId of _songIds) {
        this._statements.insertUserSong.run([userId, songId]);
      }
    });
    insertMany(songIds);
    this.reloadCache();
  }

  public removeSongs(userId: string, songIds: string[]): void {
    const removeMany = this._db.transaction((_songIds: string[]) => {
      for (const songId of _songIds) {
        this._statements.deleteUserSongByUserIdAndSongId.run([userId, songId]);
      }
    });
    removeMany(songIds);
    this.reloadCache();
  }

  public removeSongAll(songId: string): void {
    this._statements.deleteUserSongBySongId.run([songId]);
    this.reloadCache();
  }

  public validateLessThanFiftySongs(songIds: string[]) {
    if (songIds.length > 50) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds.length });
      throw new GameDataValidationError('Song list too long');
    }
  }

  public validateSongsNotExistsInUserList(userId: string, songIds: string[]): void {
    const params = [userId].concat(songIds);
    const existSongs = new GetListUserSongByUserIdAndSongIds(this._db, songIds.length).all(params);

    if (existSongs.length > 0) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds });
      throw new GameDataValidationError('Song already exists in list');
    }
  }

  public validateSongsExistsInUserList(userId: string, songIds: string[]): void {
    const params = [userId].concat(songIds);
    const existSongs = new GetListUserSongByUserIdAndSongIds(this._db, songIds.length).all(params);

    if (existSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds });
      throw new GameDataValidationError('Song does not exist in list');
    }
  }

  public validateUsernameNotExist(username: string): void {
    const users = this._statements.getUserByUsername.all([username]);
    if (users.length > 0) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { username: username });
      throw new GameDataValidationError('Username already exists');
    }
  }

  public validateUserExist(userId: string): void {
    const users = this._statements.getUserById.all([userId]);
    if (users.length !== 1) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { userId: userId });
      throw new GameDataValidationError('User does not exist');
    }
  }
}

export { UserDb };
