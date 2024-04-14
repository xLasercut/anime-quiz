import { ServerHandler } from './common';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';

class AdminGeneralHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_LOCK_DATABASE]: () => {
      this._logger.info('admin lock database', {
        clientData: this._socket.data.clientData
      });
      this._validateIsAdmin();
      this._dbLock.lock();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: 'Database locked'
        },
        this._socket.id
      );
    },
    [SOCKET_EVENTS.ADMIN_UNLOCK_DATABASE]: () => {
      this._logger.info('admin unlock database', {
        clientData: this._socket.data.clientData
      });
      this._validateIsAdmin();
      this._dbLock.unlock();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: 'Database unlocked'
        },
        this._socket.id
      );
    },
    [SOCKET_EVENTS.ADMIN_RELOAD_DATABASE]: () => {
      this._logger.info('admin reload database', {
        clientData: this._socket.data.clientData
      });
      this._validateIsAdmin();
      this._dbLock.validateLocked();
      this._animeDb.reloadDb();
      this._emojiDb.reloadDb();
      this._songDb.reloadDb();
      this._userDb.reloadDb();
      this._userSongDb.reloadDb();
      this._botMessageDb.reloadDb();
      this._songStatsDb.reloadDb();
      this._emitter.updateStoreSongTitles();
      this._emitter.updateStoreAnimeNames();
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreAnimeList();
      this._emitter.updateStoreEmojiList();
      this._emitter.updateStoreDataVersion();
      this._emitter.updateStoreBotMessageList();
      this._emitter.updateStoreSongStatsRecords();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: 'Database reloaded'
        },
        this._socket.id
      );
    }
  };
}

export { AdminGeneralHandler };
