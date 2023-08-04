import Database, { Database as SqliteDb } from 'better-sqlite3';
import { Logger } from '../app/logging/logger';

function _reopenDatabase(currentDb: SqliteDb | null, filepath: string): SqliteDb {
  if (currentDb) {
    currentDb.close();
  }
  const db = new Database(filepath, { fileMustExist: true });
  db.pragma('journal_mode = WAL');
  return db;
}

abstract class AbstractDb {
  protected _db: SqliteDb;
  protected _filepath: string;
  protected _logger: Logger;

  protected constructor(filepath: string, logger: Logger) {
    this._filepath = filepath;
    this._logger = logger;
    this._db = _reopenDatabase(null, this._filepath);
  }

  public reloadDb(): void {
    this._db = _reopenDatabase(this._db, this._filepath);
  }

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',');
  }
}

export { AbstractDb };
