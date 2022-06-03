import { Database as SqlDatabase } from 'better-sqlite3'
import * as Database from 'better-sqlite3'
import { Logger } from '../app/logging/logger'

class AbstractDb {
  protected _db: SqlDatabase
  protected _filepath: string
  protected _logger: Logger

  constructor(logger: Logger, filepath: string) {
    this._filepath = filepath
    this._logger = logger
    this.reloadDb()
  }

  public reloadDb(): void {
    if (this._db) {
      this._db.close()
    }
    this._db = new Database(this._filepath, { fileMustExist: true })
  }

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',')
  }

  protected _sanitizeString(val: string): string | null {
    if (!val) {
      return null
    }
    return val.trim()
  }
}

export {
  AbstractDb
}
