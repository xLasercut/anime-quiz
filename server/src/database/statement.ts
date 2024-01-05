import { Database as SqliteDb, Statement } from 'better-sqlite3';

class StatementFactory {
  protected _db: SqliteDb;
  protected _statements: { [key: string]: Statement };

  constructor(db: SqliteDb, rawStatements: { [key: string]: string }) {
    this._db = db;
    this._statements = {};
    for (const [key, sql] of Object.entries(rawStatements)) {
      this._statements[key] = this._db.prepare(sql);
    }
  }

  public getStatement(name: string): Statement {
    return this._statements[name];
  }
}

export { StatementFactory };
