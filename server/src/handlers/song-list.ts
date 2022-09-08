import { Logger } from '../app/logging/logger';
import { AbstractHandler } from './abstract';
import { SHARED_EVENTS } from '../shared/events';
import { UserDb } from '../database/user';
import { ROOM_IDS } from '../constants';
import { ISocket } from '../types';
import { SongDb } from '../database/song';
import { SongDbEmitter } from '../emitters/song';
import { UserDbEmitter } from '../emitters/user';
import { SystemEmitter } from '../emitters/system';
import { Server } from '../app/server';
import { SUCCESS } from '../shared/constants/colors';

class SongListHandler extends AbstractHandler {
  protected _songDb: SongDb;
  protected _userDb: UserDb;
  protected _songDbEmitter: SongDbEmitter;
  protected _userDbEmitter: UserDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(io: Server, logger: Logger, songDb: SongDb, userDb: UserDb) {
    super(logger);
    this._songDb = songDb;
    this._userDb = userDb;
    this._songDbEmitter = new SongDbEmitter(io, songDb);
    this._userDbEmitter = new UserDbEmitter(io, userDb);
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function): void {
    socket.on(SHARED_EVENTS.JOIN_SONG_LIST, () => {
      try {
        socket.join(ROOM_IDS.SONG_LIST);
        this._songDbEmitter.updateSongList(socket.id);
        this._songDbEmitter.updateAnimeList(socket.id);
        this._songDbEmitter.updateSongTitleList(socket.id);
        this._userDbEmitter.updateUserLists(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(
      SHARED_EVENTS.ADD_USER_SONGS,
      (songIds: string[], userId: string, callback: Function) => {
        try {
          this._songDb.validateDbNotLocked();
          this._userDb.validateDbNotLocked();
          this._userDb.validateLessThanFiftySongs(songIds);
          this._userDb.validateUserExist(userId);
          this._songDb.validateSongsExist(songIds);
          this._userDb.validateSongsNotExistsInUserList(userId, songIds);
          this._userDb.addSongs(userId, songIds);
          this._userDbEmitter.updateUserLists(ROOM_IDS.SONG_LIST);
          this._systemEmitter.systemNotification(
            SUCCESS,
            `Added ${songIds.length} songs to list`,
            socket.id
          );
          callback(true);
        } catch (e) {
          errorHandler(e);
          callback(false);
        }
      }
    );

    socket.on(
      SHARED_EVENTS.DELETE_USER_SONGS,
      (songIds: string[], userId: string, callback: Function) => {
        try {
          this._songDb.validateDbNotLocked();
          this._userDb.validateDbNotLocked();
          this._userDb.validateLessThanFiftySongs(songIds);
          this._userDb.validateUserExist(userId);
          this._songDb.validateSongsExist(songIds);
          this._userDb.validateSongsExistsInUserList(userId, songIds);
          this._userDb.removeSongs(userId, songIds);
          this._userDbEmitter.updateUserLists(ROOM_IDS.SONG_LIST);
          this._systemEmitter.systemNotification(
            SUCCESS,
            `Removed ${songIds.length} songs from list`,
            socket.id
          );
          callback(true);
        } catch (e) {
          errorHandler(e);
          callback(false);
        }
      }
    );
  }
}

export { SongListHandler };
