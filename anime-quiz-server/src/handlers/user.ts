import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { ClientDataType, SongIdType } from '../shared/models/types';
import { ClientData } from '../shared/models/client';
import { LOG_REFERENCES } from '../app/logging/constants';
import { SongId } from '../shared/models/song';

class UserHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.UPDATE_USER_SETTINGS]: (_clientData: ClientDataType) => {
      this._logger.writeLog(LOG_REFERENCES.UPDATE_USER_SETTINGS, {
        clientData: this._socket.data.clientData,
        request: _clientData
      });
      this._validateCanWriteToDb();
      const clientData = ClientData.parse(_clientData);
      this._userDb.updateUserSettings(clientData, this._socket.data.clientData.discordId);
      this._socket.data.updateUserSettings(clientData);
      this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Updated user settings' }, this._socket.id);
    },
    [SOCKET_EVENTS.ADD_USER_SONGS]: (_songs: SongIdType[], callback: Function) => {
      this._validateCanWriteToDb();
      const songs = _songs.map((songId) => SongId.parse(songId));
      this._userDb.validateUserSongsNotExists(songs, this._socket.data.clientData.userId);
      this._userDb.addUserSongs(songs, this._socket.data.clientData.userId);
      this._emitter.updateStoreUserSongList(this._userDb.getUserSongList(this._socket.data.clientData.discordId), this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Added songs' }, this._socket.id);
      callback(true);
    },
    [SOCKET_EVENTS.REMOVE_USER_SONGS]: (_songs: SongIdType[], callback: Function) => {
      this._validateCanWriteToDb();
      const songs = _songs.map((songId) => SongId.parse(songId));
      this._userDb.validateUserSongsExists(songs, this._socket.data.clientData.userId);
      this._userDb.deleteUserSongs(songs, this._socket.data.clientData.userId);
      this._emitter.updateStoreUserSongList(this._userDb.getUserSongList(this._socket.data.clientData.discordId), this._socket.id);
      this._emitter.systemNotification({ color: 'success', message: 'Removed songs' }, this._socket.id);
      callback(true);
    }
  };

  protected _validateCanWriteToDb(): void {
    this._dbLock.validateNotLocked();
    this._userDb.validateAllowedUser(this._socket.data.clientData.discordId);
  }
}

export { UserHandler };
