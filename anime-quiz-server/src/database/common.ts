import Database, { Database as SqliteDb } from 'better-sqlite3';
import { Logger } from '../app/logging/logger';
import { ServerConfig } from '../interfaces';

function _databaseConnection(currentDb: SqliteDb | null, filepath: string): SqliteDb {
  if (currentDb) {
    currentDb.close();
  }
  const db = new Database(filepath, { fileMustExist: true });
  db.pragma('journal_mode = WAL');
  return db;
}

function mainDbConnection(currentDb: SqliteDb | null, config: ServerConfig) {
  return _databaseConnection(currentDb, config.mainDbPath);
}

function userDbConnection(currentDb: SqliteDb | null, config: ServerConfig) {
  return _databaseConnection(currentDb, config.userDbPath);
}

abstract class AbstractDb {
  protected _db: SqliteDb;
  protected _filepath: string;
  protected _logger: Logger;

  protected constructor(filepath: string, logger: Logger) {
    this._filepath = filepath;
    this._logger = logger;
    this._db = _databaseConnection(null, this._filepath);
  }

  public reloadDb(): void {
    this._db = _databaseConnection(this._db, this._filepath);
  }

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',');
  }
}

abstract class ServerDb<RecordType> {
  protected _config: ServerConfig;
  protected _logger: Logger;

  protected constructor(config: ServerConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
  }

  public abstract newRecord(record: RecordType): void;

  public abstract editRecord(record: RecordType): void;

  public abstract deleteRecord(record: RecordType): void;

  public abstract reloadDb(): void;

  public abstract reloadCache(): void;

  public abstract validateRecordExists(record: RecordType): void;

  public abstract validateRecordNotExists(record: RecordType): void;

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',');
  }
}

export { AbstractDb, ServerDb, mainDbConnection, userDbConnection };
