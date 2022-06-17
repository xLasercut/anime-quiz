import { Logger } from '../app/logging/logger';
import { AbstractHandler } from './abstract';
import { SHARED_EVENTS } from '../shared/events';
import { AnimeQuizUserDb } from '../database/user';
import { NOTIFICATION_COLOR } from '../shared/constants';
import { ROOM_IDS } from '../constants';
import { Socket } from '../types';
import { AnimeQuizSongDb } from '../database/song';
import { SongDbEmitter } from '../emitters/song';
import { UserDbEmitter } from '../emitters/user';
import { SystemEmitter } from '../emitters/system';

class SongListHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb;
  protected _userDb: AnimeQuizUserDb;
  protected _songDbEmitter: SongDbEmitter;
  protected _userDbEmitter: UserDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(
    logger: Logger,
    songDb: AnimeQuizSongDb,
    userDb: AnimeQuizUserDb,
    songDbEmitter: SongDbEmitter,
    userDbEmitter: UserDbEmitter,
    systemEmitter: SystemEmitter
  ) {
    super(logger);
    this._songDb = songDb;
    this._userDb = userDb;
    this._songDbEmitter = songDbEmitter;
    this._userDbEmitter = userDbEmitter;
    this._systemEmitter = systemEmitter;
  }

  public start(socket: Socket, errorHandler: Function): void {
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
          this._songDb.validateIsDbLocked();
          this._userDb.validateIsDbLocked();
          this._userDb.validateLessThanFiftySongs(songIds);
          this._userDb.validateUserExist(userId);
          this._songDb.validateSongsExist(songIds);
          this._userDb.validateSongsNotExistsInUserList(userId, songIds);
          this._userDb.addSongs(userId, songIds);
          this._userDbEmitter.updateUserLists(ROOM_IDS.SONG_LIST);
          this._systemEmitter.systemNotification(
            NOTIFICATION_COLOR.SUCCESS,
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
          this._songDb.validateIsDbLocked();
          this._userDb.validateIsDbLocked();
          this._userDb.validateLessThanFiftySongs(songIds);
          this._userDb.validateUserExist(userId);
          this._songDb.validateSongsExist(songIds);
          this._userDb.validateSongsExistsInUserList(userId, songIds);
          this._userDb.removeSongs(userId, songIds);
          this._userDbEmitter.updateUserLists(ROOM_IDS.SONG_LIST);
          this._systemEmitter.systemNotification(
            NOTIFICATION_COLOR.SUCCESS,
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
