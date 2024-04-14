import { ServerHandler } from './common';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TAnime } from 'anime-quiz-shared-resources/src/models/types';
import { Anime } from 'anime-quiz-shared-resources/src/models/anime';

class AdminAnimeHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_ANIME]: (_anime: TAnime, callback: Function) => {
      this._logger.info('admin add anime', {
        clientData: this._socket.data.clientData,
        request: _anime
      });
      this._validateCanWriteDbAdmin();
      const anime = Anime.parse(_anime);
      this._animeDb.validateRecordNotExists(anime);
      this._animeDb.newRecord(anime);
      this._emitter.updateStoreAnimeList();
      this._emitter.updateStoreAnimeNames();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Added anime ${anime.animeName[0]}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_ANIME]: (_anime: TAnime, callback: Function) => {
      this._logger.info('admin edit anime', {
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
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Edited anime ${anime.animeName[0]}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_ANIME]: (_anime: TAnime, callback: Function) => {
      this._logger.info('admin delete anime', {
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
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Deleted anime ${anime.animeName[0]}`
        },
        this._socket.id
      );
      callback(true);
    }
  };
}

export { AdminAnimeHandler };
