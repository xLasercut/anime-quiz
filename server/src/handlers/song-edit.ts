import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { ISong } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { UserDb } from '../database/user';
import { SongDb } from '../database/song';
import { SongDbEmitter } from '../emitters/song';
import { SystemEmitter } from '../emitters/system';
import { NewSong, Song } from '../models/song';
import { Server } from '../app/server';
import { SUCCESS } from '../shared/constants/colors';

class SongEditHandler extends AbstractHandler {
  protected _songDb: SongDb;
  protected _userDb: UserDb;
  protected _songDbEmitter: SongDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(io: Server, logger: Logger, songDb: SongDb, userDb: UserDb) {
    super(logger);
    this._songDb = songDb;
    this._userDb = userDb;
    this._songDbEmitter = new SongDbEmitter(io, songDb);
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_SONG_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.SONG_EDIT);
        this._songDbEmitter.updateSongList(socket.id);
        this._songDbEmitter.updateSongTitleList(socket.id);
        this._songDbEmitter.updateAnimeList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_SONG, (_song: ISong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: _song, type: 'add' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const song = new NewSong(_song).dict();
        this._songDb.validateAnimesExist(song.anime_id);
        this._songDb.newSong(song);
        this._systemEmitter.systemNotification(SUCCESS, `Added ${song.song_title}`, socket.id);
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_SONG, (_song: ISong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: _song, type: 'delete' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const song = new Song(_song).dict();
        this._songDb.validateSongsExist([song.song_id]);
        this._songDb.deleteSong(song);
        this._userDb.removeSongAll(song.song_id);
        this._systemEmitter.systemNotification(SUCCESS, `Deleted ${song.song_title}`, socket.id);
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_SONG, (_song: ISong, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_SONG_EDIT, { song: _song, type: 'edit' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const song = new Song(_song).dict();
        this._songDb.validateSongsExist([song.song_id]);
        this._songDb.validateAnimesExist(song.anime_id);
        this._songDb.editSong(song);
        this._systemEmitter.systemNotification(SUCCESS, `Edited ${song.song_title}`, socket.id);
        this._songDbEmitter.updateSongList(ROOM_IDS.SONG_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });
  }
}

export { SongEditHandler };
