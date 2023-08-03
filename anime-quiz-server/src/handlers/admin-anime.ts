import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { AnimeType } from '../shared/models/types';

class AdminAnimeHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._validateCanWriteToDb();
    },
    [SOCKET_EVENTS.ADMIN_EDIT_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._validateCanWriteToDb();
    },
    [SOCKET_EVENTS.ADMIN_DELETE_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._validateCanWriteToDb();
    }
  };

  protected _validateCanWriteToDb(): void {
    this._validateIsAdmin();
    this._animeDb.validateDbNotLocked();
  }
}

export { AdminAnimeHandler };
