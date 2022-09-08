import { AbstractHandler } from './abstract';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { Logger } from '../app/logging/logger';
import { ROOM_NAME_PREFIX } from '../constants';
import { v4 } from 'uuid';
import { Server } from '../app/server';
import { ROOM_NAME_FORMAT } from '../shared/constants/formats';
import { LOG_BASE } from '../app/logging/log-base';
import { GameDataValidationError } from '../app/exceptions';
import { GameSettingsDb } from '../game/settings';
import { IGameGuess, IGameSettings, ISong } from '../shared/interfaces';
import { GameStatesDb } from '../game/state';
import { GameListGeneratorFactory } from '../game/generator/factory';
import { EmojiDbEmitter } from '../emitters/emoji';
import { GameEmitter } from '../emitters/game';
import { UserDbEmitter } from '../emitters/user';
import { SongDbEmitter } from '../emitters/song';
import { SystemEmitter } from '../emitters/system';
import { GameGuess } from '../models/game';
import { UserDb } from '../database/user';
import { SongDb } from '../database/song';
import { EmojiDb } from '../database/emoji';

class GameHandler extends AbstractHandler {
  protected _io: Server;
  protected _settings: GameSettingsDb;
  protected _states: GameStatesDb;
  protected _userDbEmitter: UserDbEmitter;
  protected _songDbEmitter: SongDbEmitter;
  protected _emojiDbEmitter: EmojiDbEmitter;
  protected _gameEmitter: GameEmitter;
  protected _systemEmitter: SystemEmitter;
  protected _gameListGeneratorFactory: GameListGeneratorFactory;

  constructor(
    io: Server,
    logger: Logger,
    settings: GameSettingsDb,
    states: GameStatesDb,
    userDb: UserDb,
    songDb: SongDb,
    emojiDb: EmojiDb
  ) {
    super(logger);
    this._io = io;
    this._settings = settings;
    this._states = states;
    this._userDbEmitter = new UserDbEmitter(io, userDb);
    this._songDbEmitter = new SongDbEmitter(io, songDb);
    this._emojiDbEmitter = new EmojiDbEmitter(io, emojiDb);
    this._gameEmitter = new GameEmitter(io, logger, settings, states);
    this._systemEmitter = new SystemEmitter(io);
    this._gameListGeneratorFactory = new GameListGeneratorFactory(songDb, userDb);
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateNewRoomName(roomName);
        const roomId = `${ROOM_NAME_PREFIX}|${roomName}|${v4()}`;
        if (socket.data.admin) {
          this._songDbEmitter.updateSongList(socket.id);
        }
        this._songDbEmitter.updateAnimeList(socket.id);
        this._songDbEmitter.updateSongTitleList(socket.id);
        this._userDbEmitter.updateUserLists(socket.id);
        this._emojiDbEmitter.updateEmojiList(socket.id);
        socket.data.host = true;
        this._systemEmitter.updateClientData(socket.data.getClientData(), socket.id);
        socket.join(roomId);
        callback(true);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    });

    socket.on(SHARED_EVENTS.JOIN_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateExistingRoomName(roomName);
        if (socket.data.admin) {
          this._songDbEmitter.updateSongList(socket.id);
        }
        this._songDbEmitter.updateAnimeList(socket.id);
        this._songDbEmitter.updateSongTitleList(socket.id);
        this._userDbEmitter.updateUserLists(socket.id);
        this._emojiDbEmitter.updateEmojiList(socket.id);
        socket.data.host = false;
        this._systemEmitter.updateClientData(socket.data.getClientData(), socket.id);
        socket.join(roomName);
        callback(true);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GAME_CHAT, (message: string) => {
      try {
        const roomId = this._getSocketGameRoom(socket);
        this._gameEmitter.updateGameChat(socket, message, roomId);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.EDIT_GUESS, (_guess: IGameGuess) => {
      try {
        const roomId = this._getSocketGameRoom(socket);
        const guess = new GameGuess(_guess).dict();
        socket.data.gameGuess = guess;
        socket.data.pendingScore = this._states.calculateScore(guess, roomId);
        this._gameEmitter.updateGuess(socket.data.gameGuess, socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.START_GAME, async () => {
      try {
        const roomId = this._getSocketGameRoom(socket);
        const settings = this._settings.getGameSettings(roomId);
        const gameList = this._generateGameList(settings);
        this._validateGameSongList(gameList);
        this._states.startGame(roomId, gameList);
        this._gameEmitter.gameNewRound(roomId);
        const gameState = this._states.getGameState(roomId);
        this._gameEmitter.updateGameState(roomId, roomId);
        this._io.resetScore(roomId);
        this._gameEmitter.updateGamePlayerList(roomId, roomId);
        this._logger.writeLog(LOG_BASE.NEW_GAME, {
          roomId: roomId,
          settings: settings,
          state: gameState
        });
        await this._newRound(roomId, settings);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.STOP_GAME, () => {
      try {
        const roomId = this._getSocketGameRoom(socket);
        this._stopGame(roomId);
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GAME_SONG_LOADED, () => {
      try {
        socket.data.songLoaded = true;
      } catch (e) {
        errorHandler(e);
      }
    });
  }

  protected _sanitiseGuess(guess: IGameGuess): IGameGuess {
    return {
      anime: (guess.anime || '').trim(),
      title: (guess.title || '').trim()
    };
  }

  protected async _newRound(roomId: string, settings: IGameSettings): Promise<void> {
    const startPosition = Math.random();
    const gameState = this._states.getGameState(roomId);
    this._logger.writeLog(LOG_BASE.NEW_GAME_ROUND, { state: gameState, roomId: roomId });
    this._gameEmitter.gameNewRound(roomId);
    this._io.newRound(roomId);
    this._gameEmitter.updateGameState(roomId, roomId);
    await this._states.startTimeout(2000, roomId);
    this._gameEmitter.gameStartLoad(startPosition, settings.guessTime, roomId);
    this._states.clearSongOverride(roomId);
    await this._states.waitPlayerLoaded(10000, roomId);
    this._gameEmitter.gameStartCountdown(roomId);
    await this._states.startTimeout(settings.guessTime * 1000, roomId);
    this._io.updateScore(roomId);
    this._gameEmitter.updateGamePlayerList(roomId, roomId);
    this._gameEmitter.gameShowGuess(roomId);
    if (!this._states.isLastSong(roomId)) {
      this._states.nextSong(roomId);
      await this._states.startTimeout(10000, roomId);
      await this._newRound(roomId, settings);
    } else {
      this._stopGame(roomId);
    }
  }

  protected _stopGame(roomId: string): void {
    this._states.stopGame(roomId);
    this._gameEmitter.updateGameState(roomId, roomId);
    this._gameEmitter.stopClientGame(roomId);
  }

  protected _generateGameList(settings: IGameSettings): ISong[] {
    const generator = this._gameListGeneratorFactory.getGenerator(settings);
    return generator.generate();
  }

  protected _validateGameSongList(songList: ISong[]): void {
    if (songList.length === 0) {
      throw new GameDataValidationError('Empty song list');
    }
  }

  protected _validateNewRoomName(roomName: string): void {
    if (!ROOM_NAME_FORMAT.test(roomName)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomName: roomName });
      throw new GameDataValidationError('Invalid room name');
    }
  }

  protected _validateExistingRoomName(roomId: string): void {
    if (!this._io.isGameRoomExists(roomId)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomName: roomId });
      throw new GameDataValidationError('Room does not exist');
    }
  }
}

export { GameHandler };
