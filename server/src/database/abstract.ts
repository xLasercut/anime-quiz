import { Database, OPEN_READWRITE } from 'sqlite3'
import { Logger } from '../app/logging/logger'

class AbstractDb {
  protected _filepath: string
  protected _db: Database
  protected _logger: Logger

  constructor(filepath: string, logger: Logger) {
    this._filepath = filepath
    this._db = new Database(this._filepath, OPEN_READWRITE)
    this._logger = logger
  }

  public async reloadDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db.close((err) => {
        if (err) {
          reject(err)
        }
        this._db = new Database(this._filepath, OPEN_READWRITE)
        resolve()
      })
    })
  }

  protected _questionString(size: number): string {
    return new Array(size).fill('?').join(',')
  }

  protected async _all(sql: string, params: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  protected async _run(sql: string, params: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db.run(sql, params, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}

export {
  AbstractDb
}
