import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class DataHandler extends AbstractHandler {
  protected _events = {
    [SOCKET_EVENTS.UPDATE_STORE_USER_LIST]: () => {
      this._emitter.updateStoreUserList(this._userDb.getUserList(), this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES]: () => {
      this._emitter.updateStoreSongTitles(this._songDb.songTitles, this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_SONG_LIST]: () => {
      this._emitter.updateStoreSongList(this._songDb.songList, this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST]: () => {
      this._emitter.updateStoreAnimeList(this._animeDb.animeList, this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES]: () => {
      this._emitter.updateStoreAnimeNames(this._animeDb.animeNames, this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST]: () => {
      this._emitter.updateStoreUserSongList(this._userDb.getUserSongList(this._socket.data.clientData.discordId), this._socket.id);
    }
  };
}

export { DataHandler };
