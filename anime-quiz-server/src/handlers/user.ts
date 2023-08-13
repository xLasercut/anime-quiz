import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { ClientDataType, SongIdType } from '../shared/models/types';
import { ClientData } from '../shared/models/client';
import { SongId } from '../shared/models/song';

class UserHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.UPDATE_USER_SETTINGS]: (_clientData: ClientDataType) => {
      this._logger.info('updating user settings', {
        clientData: this._socket.data.clientData,
        request: _clientData
      });
      this._validateCanWriteDbNonAdmin();
      const clientData = ClientData.parse(_clientData);
      this._userDb.updateUserSettings(clientData, this._socket.data.clientData.userId);
      this._socket.data.updateUserSettings(clientData);
      this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Updated user settings' }, this._socket.id);
    },
    [SOCKET_EVENTS.ADD_USER_SONGS]: (_songs: SongIdType[], callback: Function) => {
      this._logger.info('add user songs', {
        clientData: this._socket.data.clientData,
        request: _songs
      });
      this._validateCanWriteDbNonAdmin();
      const songs = _songs.map((songId) => SongId.parse(songId));
      const dbUserSongs = this._socket.data.generateDbUserSongs(songs);
      this._userSongDb.validateRecordNotExists(dbUserSongs);
      this._userSongDb.newRecord(dbUserSongs);
      this._emitter.updateStoreUserSongList(dbUserSongs.user_id, this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Added songs' }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.REMOVE_USER_SONGS]: (_songs: SongIdType[], callback: Function) => {
      this._logger.info('remove user songs', {
        clientData: this._socket.data.clientData,
        request: _songs
      });
      this._validateCanWriteDbNonAdmin();
      const songs = _songs.map((songId) => SongId.parse(songId));
      const dbUserSongs = this._socket.data.generateDbUserSongs(songs);
      this._userSongDb.validateRecordExists(dbUserSongs);
      this._userSongDb.deleteRecord(dbUserSongs);
      this._emitter.updateStoreUserSongList(dbUserSongs.user_id, this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Removed songs' }, this._socket.id);
      callback(true);
    }
  };
}

export { UserHandler };
