import * as Database from 'better-sqlite3';
import { Database as SqlDatabase } from 'better-sqlite3';
import { Logger } from '../app/logging/logger';
import { DatabaseLockedError } from '../app/exceptions';

class AbstractDb {
  protected _db: SqlDatabase;
  protected _filepath: string;
  protected _logger: Logger;
  protected _locked: boolean;

  constructor(logger: Logger, filepath: string) {
    this._filepath = filepath;
    this._logger = logger;
    this._locked = false;
    this.reloadDb();
  }

  public lockDb(): void {
    this._locked = true;
  }

  public unlockDb(): void {
    this._locked = false;
  }

  public validateIsDbLocked(): void {
    if (this._locked) {
      throw new DatabaseLockedError('Database locked pending server upgrade');
    }
  }

  public reloadDb(): void {
    if (this._db) {
      this._db.close();
    }
    this._db = new Database(this._filepath, { fileMustExist: true });
  }

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',');
  }

  protected _sanitizeString(val: string): string | null {
    if (!val) {
      return null;
    }
    return val.trim();
  }
}

export { AbstractDb };
