import { ServerHandler } from './common';
import { SOCKET_EVENTS, SONG_TYPES, SongStats, TSongStats } from 'anime-quiz-shared-resources';

class AdminSongStatsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_SONG_STATS]: (_songStats: TSongStats, callback: Function) => {
      this._logger.info('admin new song stats', {
        clientData: this._socket.data.clientData,
        request: _songStats
      });
      this._validateCanWriteDbAdmin();
      const songStats = SongStats.parse(_songStats);
      this._songStatsDb.validateRecordNotExists(songStats);
      this._songDb.validateRecordExists({
        songId: songStats.songId,
        src: '',
        type: SONG_TYPES.OP,
        songTitle: '',
        artist: '',
        animeName: [],
        animeId: [],
        audioSrc: ''
      });
      this._songStatsDb.newRecord(songStats);
      this._emitter.updateStoreSongStatsRecords();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Added song stats ${songStats.songId}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_SONG_STATS]: (_songStats: TSongStats, callback: Function) => {
      this._logger.info('admin edit song stats', {
        clientData: this._socket.data.clientData,
        request: _songStats
      });
      this._validateCanWriteDbAdmin();
      const songStats = SongStats.parse(_songStats);
      this._songStatsDb.validateRecordExists(songStats);
      this._songStatsDb.editRecord(songStats);
      this._emitter.updateStoreSongStatsRecords();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Edited song stats ${songStats.songId}`
        },
        this._socket.id
      );
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_SONG_STATS]: (_songStats: TSongStats, callback: Function) => {
      this._logger.info('admin delete song stats', {
        clientData: this._socket.data.clientData,
        request: _songStats
      });
      this._validateCanWriteDbAdmin();
      const songStats = SongStats.parse(_songStats);
      this._songStatsDb.validateRecordExists(songStats);
      this._songStatsDb.deleteRecord(songStats);
      this._emitter.updateStoreSongStatsRecords();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Deleted song stats ${songStats.songId}`
        },
        this._socket.id
      );
      callback(true);
    }
  };
}

export { AdminSongStatsHandler };
