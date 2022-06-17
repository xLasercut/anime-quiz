import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { Socket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { ROOM_IDS } from '../constants';
import { AqAnime } from '../shared/interfaces';
import { NOTIFICATION_COLOR } from '../shared/constants';
import { LOG_BASE } from '../app/logging/log-base';
import { AnimeQuizSongDb } from '../database/song';
import { SongDbEmitter } from '../emitters/song';
import { SystemEmitter } from '../emitters/system';

class AnimeEditHandler extends AbstractHandler {
  protected _songDb: AnimeQuizSongDb;
  protected _songDbEmitter: SongDbEmitter;
  protected _systemEmitter: SystemEmitter;

  constructor(
    logger: Logger,
    systemEmitter: SystemEmitter,
    songDb: AnimeQuizSongDb,
    songDbEmitter: SongDbEmitter
  ) {
    super(logger);
    this._songDb = songDb;
    this._songDbEmitter = songDbEmitter;
    this._systemEmitter = systemEmitter;
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_ANIME_EDIT, () => {
      try {
        this._validateIsAdmin(socket);
        socket.join(ROOM_IDS.ANIME_EDIT);
        this._songDbEmitter.updateAnimeList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_EDIT_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'edit' });
        this._validateIsAdmin(socket);
        this._songDb.validateIsDbLocked();
        this._songDb.validateAnimeExist([anime.anime_id]);
        this._songDb.editAnime(anime);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
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

    socket.on(SHARED_EVENTS.ADMIN_NEW_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'add' });
        this._validateIsAdmin(socket);
        this._songDb.validateIsDbLocked();
        this._songDb.newAnime(anime);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
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

    socket.on(SHARED_EVENTS.ADMIN_DELETE_ANIME, (anime: AqAnime, callback: Function) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_ANIME_EDIT, { anime: anime, type: 'delete' });
        this._validateIsAdmin(socket);
        this._songDb.validateIsDbLocked();
        this._songDb.validateAnimeExist([anime.anime_id]);
        this._songDb.deleteAnime(anime);
        this._systemEmitter.systemNotification(
          NOTIFICATION_COLOR.SUCCESS,
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
