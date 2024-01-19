import Database, { Database as SqliteDb } from 'better-sqlite3';
import { ServerConfig } from '../interfaces';
import { v4 } from 'uuid';
import { Logger } from 'winston';

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

function gameDbConnection(currentDb: SqliteDb | null, config: ServerConfig) {
  return _databaseConnection(currentDb, config.gameDbPath);
}

class DatabaseDataState {
  protected _dataVersion: string;

  constructor() {
    this._dataVersion = `${v4()}`;
  }

  public get dataVersion(): string {
    return this._dataVersion;
  }

  public updateState(): void {
    this._dataVersion = `${v4()}`;
  }
}

abstract class ServerDb<RecordType> {
  protected _config: ServerConfig;
  protected _logger: Logger;
  protected _state: DatabaseDataState;

  protected constructor(config: ServerConfig, logger: Logger, state: DatabaseDataState) {
    this._config = config;
    this._logger = logger;
    this._state = state;
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

export { ServerDb, mainDbConnection, userDbConnection, DatabaseDataState, gameDbConnection };
