import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { AnimeType } from '../shared/models/types';
import { Anime } from '../shared/models/anime';
import { LOG_REFERENCES } from '../app/logging/constants';

class AdminAnimeHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteDbAdmin();
      const anime = Anime.parse(_anime);
      this._animeDb.validateRecordNotExists(anime);
      this._animeDb.newRecord(anime);
      this._emitter.updateStoreAnimeList();
      this._emitter.updateStoreAnimeNames();
      this._emitter.systemNotification({ color: 'success', message: `Added anime ${anime.animeName[0]}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteDbAdmin();
      const anime = Anime.parse(_anime);
      this._animeDb.validateRecordExists(anime);
      this._animeDb.editRecord(anime);
      this._emitter.updateStoreAnimeList();
      this._emitter.updateStoreAnimeNames();
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Edited anime ${anime.animeName[0]}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_ANIME]: (_anime: AnimeType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_ANIME, {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteDbAdmin();
      const anime = Anime.parse(_anime);
      this._animeDb.validateRecordExists(anime);
      this._animeDb.deleteRecord(anime);
      this._emitter.updateStoreAnimeList();
      this._emitter.updateStoreAnimeNames();
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Deleted anime ${anime.animeName[0]}` });
      callback(true);
    }
  };
}

export { AdminAnimeHandler };
