import { ServerHandler } from './common';
import { SOCKET_EVENTS, Song, TSong } from 'anime-quiz-shared-resources';

class AdminSongHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_NEW_SONG]: (_song: TSong, callback: Function) => {
      this._logger.info('admin add song', {
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
      this._emitter.systemNotification({ color: 'success', message: `Added song ${song.songTitle}` }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_EDIT_SONG]: (_song: TSong, callback: Function) => {
      this._logger.info('admin edit song', {
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
      this._emitter.systemNotification({ color: 'success', message: `Edited song ${song.songTitle}` }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.ADMIN_DELETE_SONG]: (_song: TSong, callback: Function) => {
      this._logger.info('admin delete song', {
        clientData: this._socket.data.clientData,
        request: _song
      });
      this._validateCanWriteDbAdmin();
      const song = Song.parse(_song);
      this._songDb.validateRecordExists(song);
      this._songDb.deleteRecord(song);
      this._emitter.updateStoreSongList();
      this._emitter.updateStoreSongTitles();
      this._emitter.systemNotification({ color: 'success', message: `Deleted song ${song.songTitle}` }, this._socket.id);
      callback(true);
    }
  };
}

export { AdminSongHandler };
