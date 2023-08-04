import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { AnimeType } from '../shared/models/types';
import { Anime } from '../shared/models/anime';
import { LOG_REFERENCES } from '../app/logging/constants';

class AdminAnimeHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteToDb();
      const anime = Anime.parse(_anime);
      this._animeDb.validateAnimeNotExists(anime);
      this._animeDb.newAnime(anime);
      this._emitter.updateStoreAnimeList(this._animeDb.getAnimeList());
      this._emitter.updateStoreAnimeNames(this._animeDb.getAnimeNames());
      this._emitter.systemNotification({ color: 'success', message: `Added anime ${anime.animeName[0]}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteToDb();
      const anime = Anime.parse(_anime);
      this._animeDb.validateAnimeExists(anime);
      this._animeDb.editAnime(anime);
      this._emitter.updateStoreAnimeList(this._animeDb.getAnimeList());
      this._emitter.updateStoreAnimeNames(this._animeDb.getAnimeNames());
      this._emitter.systemNotification({ color: 'success', message: `Edited anime ${anime.animeName[0]}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteToDb();
      const anime = Anime.parse(_anime);
      this._animeDb.validateAnimeExists(anime);
      this._animeDb.deleteAnime(anime);
      this._songDb.deleteSongAnimeByAnimeId(anime.animeId);
      this._emitter.updateStoreAnimeList(this._animeDb.getAnimeList());
      this._emitter.updateStoreAnimeNames(this._animeDb.getAnimeNames());
      this._emitter.updateStoreSongList(this._songDb.getSongList());
      this._emitter.updateStoreSongTitles(this._songDb.getSongTitles());
      this._emitter.systemNotification({ color: 'success', message: `Deleted anime ${anime.animeName[0]}` });
      callback(true);
    }
  };

  protected _validateCanWriteToDb(): void {
    this._validateIsAdmin();
    this._dbLock.validateNotLocked();
  }
}

export { AdminAnimeHandler };
