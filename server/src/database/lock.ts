import { DatabaseLockedError } from '../app/exceptions';

class DatabaseLock {
  protected _locked: boolean = false;

  public lock(): void {
    this._locked = true;
  }

  public unlock(): void {
    this._locked = false;
  }

  public validateNotLocked(): void {
    if (this._locked) {
      throw new DatabaseLockedError('Database locked pending server upgrade');
    }
  }

  public validateLocked(): void {
    if (!this._locked) {
      throw new DatabaseLockedError('Database is not locked');
    }
  }
}

export { DatabaseLock };
