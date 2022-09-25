import { AbstractHandler } from './abstract';
import { ISocket } from '../types';
import { Logger } from '../app/logging/logger';
import { SHARED_EVENTS } from '../shared/events';
import { LOG_BASE } from '../app/logging/log-base';
import { Server } from '../app/server';
import { EmojiDb } from '../database/emoji';
import { SongDb } from '../database/song';
import { UserDb } from '../database/user';
import { GameStatesDb } from '../game/state';
import { SystemEmitter } from '../emitters/system';
import { ERROR, SUCCESS } from '../shared/constants/colors';

class AdminHandler extends AbstractHandler {
  protected _emojiDb: EmojiDb;
  protected _songDb: SongDb;
  protected _userDb: UserDb;
  protected _io: Server;
  protected _states: GameStatesDb;
  protected _systemEmitter: SystemEmitter;

  constructor(
    logger: Logger,
    io: Server,
    songDb: SongDb,
    emojiDb: EmojiDb,
    userDb: UserDb,
    states: GameStatesDb
  ) {
    super(logger);
    this._songDb = songDb;
    this._io = io;
    this._emojiDb = emojiDb;
    this._userDb = userDb;
    this._states = states;
    this._systemEmitter = new SystemEmitter(io);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.ADMIN_RELOAD_DB, () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_RELOAD_DB);
        this._validateIsAdmin(socket);
        this._songDb.reloadDb();
        this._songDb.reloadCache();
        this._emojiDb.reloadDb();
        this._emojiDb.reloadCache();
        this._systemEmitter.systemNotification(SUCCESS, 'Database reloaded');
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_KICK_PLAYER, (playerId: string) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_KICK_PLAYER, { kickedPlayerId: playerId });
        this._validateIsAdmin(socket);
        this._systemEmitter.systemNotification(ERROR, 'You have been kicked', playerId);
        this._io.kickPlayer(playerId);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_LOCK_DB, () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_LOCK_DB, { action: 'lock' });
        this._validateIsAdmin(socket);
        this._userDb.lockDb();
        this._songDb.lockDb();
        this._emojiDb.lockDb();
        this._systemEmitter.systemNotification(SUCCESS, 'Database locked', socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_UNLOCK_DB, () => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_LOCK_DB, { action: 'unlock' });
        this._validateIsAdmin(socket);
        this._userDb.unlockDb();
        this._songDb.unlockDb();
        this._emojiDb.unlockDb();
        this._systemEmitter.systemNotification(SUCCESS, 'Database unlocked', socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.ADMIN_GAME_SONG_OVERRIDE, (songId: string) => {
      try {
        this._logger.writeLog(LOG_BASE.ADMIN_GAME_SONG_OVERRIDE, { songId: songId });
        this._validateIsAdmin(socket);
        const roomId = this._getSocketGameRoom(socket);
        const songs = this._songDb.getSelectedUserSongs([songId]);
        if (songs.length === 1) {
          this._states.songOverride(songs[0], roomId);
          this._systemEmitter.systemNotification(SUCCESS, 'Song selected', socket.id);
        }
      } catch (e) {
        errorHandler(e);
      }
    });
  }
}

export { AdminHandler };
