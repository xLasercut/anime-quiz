import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { SongDbEmitter } from '../emitters/song';
import { EmojiDbEmitter } from '../emitters/emoji';
import { UserDbEmitter } from '../emitters/user';
import { UserDb } from '../database/user';
import { SongDb } from '../database/song';
import { EmojiDb } from '../database/emoji';
import { Server } from '../app/server';

class DataHandler extends AbstractHandler {
  protected _songDbEmitter: SongDbEmitter;
  protected _emojiDbEmitter: EmojiDbEmitter;
  protected _userDbEmitter: UserDbEmitter;

  constructor(io: Server, logger: Logger, userDb: UserDb, songDb: SongDb, emojiDb: EmojiDb) {
    super(logger);
    this._songDbEmitter = new SongDbEmitter(io, songDb);
    this._emojiDbEmitter = new EmojiDbEmitter(io, emojiDb);
    this._userDbEmitter = new UserDbEmitter(io, userDb);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.GET_ANIME_LIST, () => {
      try {
        this._songDbEmitter.updateAnimeList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GET_SONG_LIST, () => {
      try {
        this._songDbEmitter.updateSongList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GET_SONG_TITLE_LIST, () => {
      try {
        this._songDbEmitter.updateSongTitleList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GET_EMOJI_LIST, () => {
      try {
        this._emojiDbEmitter.updateEmojiList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GET_USER_LISTS, () => {
      try {
        this._userDbEmitter.updateUserLists(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });
  }
}

export { DataHandler };
