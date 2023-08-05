import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';

class DataHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.UPDATE_STORE_USER_LIST]: () => {
      this._validateIsAdmin();
      this._emitter.updateStoreUserList(this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES]: () => {
      this._emitter.updateStoreSongTitles(this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_SONG_LIST]: () => {
      this._emitter.updateStoreSongList(this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST]: () => {
      this._emitter.updateStoreAnimeList(this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES]: () => {
      this._emitter.updateStoreAnimeNames(this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST]: () => {
      this._emitter.updateStoreUserSongList(this._socket.data.clientData.userId, this._socket.id);
    },
    [SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST]: () => {
      this._emitter.updateStoreEmojiList(this._socket.id);
    }
  };
}

export { DataHandler };
