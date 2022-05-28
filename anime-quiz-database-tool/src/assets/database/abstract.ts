import { Database } from 'sqlite3'

class AbstractDatabase {
  protected _db: Database

  constructor(filepath: string) {
    this._db = new Database(filepath)
  }
}

export {
  AbstractDatabase
}
