import Database, { Database as SqliteDb } from 'better-sqlite3';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logger';

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

export { ServerDb, mainDbConnection, userDbConnection };
