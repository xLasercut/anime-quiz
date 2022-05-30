import { Database } from 'sqlite3'
import { Logger } from '../app/logging/logger'

class AbstractDb {
  protected _db: Database
  protected _logger: Logger

  constructor(db: Database, logger: Logger) {
    this._db = db
    this._logger = logger
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
