import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { IAnime } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { SongDb } from '../database/song';
import { SongDbEmitter } from '../emitters/song';
import { SystemEmitter } from '../emitters/system';
import { Server } from '../app/server';
import { Anime, NewAnime } from '../models/anime';
import { SUCCESS } from '../shared/constants/colors';

class AnimeEditHandler extends AbstractHandler {
  protected _songDb: SongDb;
  protected _songDbEmitter: SongDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(io: Server, logger: Logger, songDb: SongDb) {
    super(logger);
    this._songDb = songDb;
    this._songDbEmitter = new SongDbEmitter(io, songDb);
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_ANIME_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.ANIME_EDIT);
        this._songDbEmitter.updateAnimeList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_ANIME, (_anime: IAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: _anime, type: 'edit' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const anime = new Anime(_anime).dict();
        this._songDb.validateAnimesExist([anime.anime_id]);
        this._songDb.editAnime(anime);
        this._systemEmitter.systemNotification(
          SUCCESS,
          `${anime.anime_name.join(',')} edited`,
          socket.id
        );
        this._songDbEmitter.updateAnimeList(ROOM_IDS.ANIME_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_NEW_ANIME, (_anime: IAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: _anime, type: 'add' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const anime = new NewAnime(_anime).dict();
        this._songDb.newAnime(anime);
        this._systemEmitter.systemNotification(
          SUCCESS,
          `${anime.anime_name.join(',')} added`,
          socket.id
        );
        this._songDbEmitter.updateAnimeList(ROOM_IDS.ANIME_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_DELETE_ANIME, (_anime: IAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: _anime, type: 'delete' });
        this._validateIsAdmin(socket);
        this._songDb.validateDbNotLocked();
        const anime = new Anime(_anime).dict();
        this._songDb.validateAnimesExist([anime.anime_id]);
        this._songDb.deleteAnime(anime);
        this._systemEmitter.systemNotification(
          SUCCESS,
          `${anime.anime_name.join(',')} deleted`,
          socket.id
        );
        this._songDbEmitter.updateAnimeList(ROOM_IDS.ANIME_EDIT);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });
  }
}

export { AnimeEditHandler };
