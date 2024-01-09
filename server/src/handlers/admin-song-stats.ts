import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { SongStatsType } from '../shared/models/types';
import { SongStats } from '../shared/models/song-stats';

class AdminSongStatsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_EDIT_SONG_STATS]: (_songStats: SongStatsType, callback: Function) => {
      this._logger.info('admin edit song stats', {
        clientData: this._socket.data.clientData,
        request: _songStats
      });
      this._validateCanWriteDbAdmin();
      const songStats = SongStats.parse(_songStats);
      this._songStatsDb.validateRecordExists(songStats);
      this._songStatsDb.editRecord(songStats);
      this._emitter.updateStoreSongStatsList();
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Edited song stats ${songStats.songId}`
        },
        this._socket.id
      );
      callback(true);
    }
  };
}

export { AdminSongStatsHandler };
