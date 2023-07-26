import Database, { Database as SqliteDb } from 'better-sqlite3';
import { Logger } from '../app/logging/logger';
import { DatabaseLockedError } from '../app/exceptions';

abstract class AbstractDb {
  protected _db: SqliteDb;
  protected _filepath: string;
  protected _logger: Logger;
  protected _locked: boolean;

  protected constructor(logger: Logger, filepath: string) {
    this._filepath = filepath;
    this._logger = logger;
    this._locked = false;
    this._db = new Database(this._filepath, { fileMustExist: true });
    this._db.pragma('journal_mode = WAL');
  }

  public reloadDb(): void {
    this.lockDb();
    this._db.close();
    this._db = new Database(this._filepath, { fileMustExist: true });
    this._db.pragma('journal_mode = WAL');
    this.unlockDb();
  }

  public lockDb(): void {
    this._locked = true;
  }

  public unlockDb(): void {
    this._locked = false;
  }

  public validateDbNotLocked(): void {
    if (this._locked) {
      throw new DatabaseLockedError('Database locked pending server upgrade');
    }
  }
}

export { AbstractDb };
