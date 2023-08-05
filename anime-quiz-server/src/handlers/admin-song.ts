import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { SongType } from '../shared/models/types';
import { Song } from '../shared/models/song';
import { LOG_REFERENCES } from '../app/logging/constants';

class AdminSongHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteDbAdmin();
      const song = Song.parse(_song);
      this._songDb.validateRecordNotExists(song);
      this._animeDb.validateAnimesExists(song.animeId);
      this._songDb.newRecord(song);
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Added song ${song.songTitle}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteDbAdmin();
      const song = Song.parse(_song);
      this._songDb.validateRecordExists(song);
      this._animeDb.validateAnimesExists(song.animeId);
      this._songDb.editRecord(song);
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Edited song ${song.songTitle}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteDbAdmin();
      const song = Song.parse(_song);
      this._songDb.validateRecordExists(song);
      this._songDb.deleteRecord(song);
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Deleted song ${song.songTitle}` });
      callback(true);
    }
  };
}

export { AdminSongHandler };
