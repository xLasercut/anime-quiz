import { Database, Database as SqlDatabase, Statement } from 'better-sqlite3';
import { Logger } from '../app/logging/logger';
import { DatabaseLockedError } from '../app/exceptions';

abstract class AbstractDb {
  protected _db: SqlDatabase;
  protected _filepath: string;
  protected _logger: Logger;
  protected _locked: boolean;

  protected constructor(logger: Logger, filepath: string) {
    this._filepath = filepath;
    this._logger = logger;
    this._locked = false;
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

  protected _closeDb(): void {
    if (this._db) {
      this._db.close();
    }
  }
}

abstract class AbstractSqlStatement {
  protected _statement: Statement;

  protected constructor(db: Database, sql: string) {
    this._statement = db.prepare(sql);
  }

  public run(params = []) {
    return this._statement.run(params);
  }

  public all(params = []) {
    return this._statement.all(params);
  }
}

function createSqlStatement(db: Database, sql: string): Statement {
  return db.prepare(sql);
}

function questionString(size: number): string {
  return new Array(size).fill('?').join(',');
}

export { AbstractDb, createSqlStatement, AbstractSqlStatement, questionString };
