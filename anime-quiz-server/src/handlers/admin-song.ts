import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { SongType } from '../shared/models/types';
import { Song } from '../shared/models/song';
import { LOG_REFERENCES } from '../app/logging/constants';

class AdminSongHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_ADD_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteToDb();
      const song = Song.parse(_song);
      this._songDb.validateSongNotExists(song);
      this._animeDb.validateAnimesExists(song.animeId);
      this._songDb.newSong(song);
      this._emitter.updateStoreSongList(this._songDb.getSongList());
      this._emitter.updateStoreSongTitles(this._songDb.getSongTitles());
      this._emitter.systemNotification({ color: 'success', message: `Added song ${song.songTitle}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_EDIT_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteToDb();
      const song = Song.parse(_song);
      this._songDb.validateSongExists(song);
      this._animeDb.validateAnimesExists(song.animeId);
      this._songDb.editSong(song);
      this._emitter.updateStoreSongList(this._songDb.getSongList());
      this._emitter.updateStoreSongTitles(this._songDb.getSongTitles());
      this._emitter.systemNotification({ color: 'success', message: `Edited song ${song.songTitle}` });
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_SONG]: (_song: SongType, callback: Function) => {
      this._logger.writeLog(LOG_REFERENCES.ADMIN_DELETE_SONG, {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteToDb();
      const song = Song.parse(_song);
      this._songDb.validateSongExists(song);
      this._songDb.deleteSong(song);
      this._userDb.deleteUserSongsBySongId(song.songId);
      this._emitter.updateStoreSongList(this._songDb.getSongList());
      this._emitter.updateStoreSongTitles(this._songDb.getSongTitles());
      this._emitter.systemNotification({ color: 'success', message: `Deleted song ${song.songTitle}` });
      callback(true);
    }
  };

  protected _validateCanWriteToDb() {
    this._validateIsAdmin();
    this._dbLock.validateNotLocked();
  }
}

export { AdminSongHandler };
