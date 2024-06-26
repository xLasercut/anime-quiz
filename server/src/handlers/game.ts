import { ServerHandler } from './common';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { GameListGeneratorFactory } from '../game-state/game-list-generator';
import { Socket } from '../types';
import { THandlerDependencies } from '../interfaces';
import { TGameGuess, TGamePlayerLifeLineType, TGameRoomId, TGameRoomSettings } from 'anime-quiz-shared-resources';
import { GameGuess, GamePlayerLifeLineType } from 'anime-quiz-shared-resources';

class GameHandler extends ServerHandler {
  protected _generatorFactory: GameListGeneratorFactory;

  constructor(socket: Socket, errHandler: Function, dependencies: THandlerDependencies) {
    super(socket, errHandler, dependencies);
    this._generatorFactory = new GameListGeneratorFactory(dependencies);
  }

  protected _events = {
    [SOCKET_EVENTS.START_GAME]: async () => {
      const roomId = this._socket.data.currentGameRoom;
      const players = this._gameRooms.getPlayerList(roomId);
      const playerIds = players.map((player) => {
        return player.userId;
      });
      const roomSettings = this._gameRooms.getRoom(roomId).settings.dict;
      const generator = this._generatorFactory.getGenerator(roomSettings, playerIds);
      const gameSongList = generator.generate();
      this._gameRooms.getRoom(roomId).state.newGame(gameSongList);
      this._gameRooms.getRoom(roomId).state.playerNewGame();
      this._emitter.updateStorePlayerList(roomId);
      this._emitter.startGame(roomId);
      this._logger.info('new game', {
        roomId: roomId,
        settings: roomSettings,
        state: this._gameRooms.getRoom(roomId).state.dict
      });
      await this._newRound(roomId, roomSettings);
    },
    [SOCKET_EVENTS.STOP_GAME]: () => {
      const roomId = this._socket.data.currentGameRoom;
      this._stopGame(roomId);
    },
    [SOCKET_EVENTS.GAME_SONG_LOADED]: () => {
      this._socket.data.songLoaded = true;
    },
    [SOCKET_EVENTS.GAME_EDIT_GUESS]: (_guess: TGameGuess) => {
      const gameGuess = GameGuess.parse(_guess);
      const roomId = this._socket.data.currentGameRoom;
      this._socket.data.gameGuess = gameGuess;
      this._socket.data.pendingScore = this._gameRooms.getRoom(roomId).state.calculateScore(gameGuess);
      this._emitter.updateStoreGameGuess(gameGuess, this._socket.id);
    },
    [SOCKET_EVENTS.GAME_SKIP_SONG]: (callback: Function) => {
      this._socket.data.skipSong = true;
      const roomId = this._socket.data.currentGameRoom;
      this._emitter.updateStorePlayerList(roomId);
      callback(true);
    },
    [SOCKET_EVENTS.GAME_USE_LIFE_LINE]: (_lifeLineType: TGamePlayerLifeLineType) => {
      const lifeLineType = GamePlayerLifeLineType.parse(_lifeLineType);
      const success = this._socket.data.useLifeLine(lifeLineType);
      if (success) {
        this._emitter.gameShowLifeLine(lifeLineType, this._socket.id);
      }
    }
  };

  protected async _newRound(roomId: TGameRoomId, settings: TGameRoomSettings) {
    const startPosition = Math.random();
    this._emitter.gameNewRound(roomId);
    this._gameRooms.getRoom(roomId).state.newRound();
    this._emitter.updateStoreGameState(roomId);
    this._emitter.updateStorePlayerList(roomId);
    await this._gameRooms.getRoom(roomId).state.startTimeout(2000);
    this._emitter.gameStartLoad(roomId, startPosition, settings.guessTime);
    this._gameRooms.getRoom(roomId).state.songOverride = undefined;
    await this._gameRooms.getRoom(roomId).state.waitPlayerLoaded(settings.loadTime * 1000);
    this._emitter.gameStartCountdown(roomId);
    await this._gameRooms.getRoom(roomId).state.startCountdown(settings.guessTime * 1000);
    this._gameRooms.getRoom(roomId).state.updateScore();
    this._emitter.updateStorePlayerList(roomId);
    this._emitter.gameShowGuess(roomId);
    if (this._dbLock.locked) {
      this._emitter.systemNotification(
        {
          color: 'error',
          message: 'Database locked pending server upgrade'
        },
        roomId
      );
      this._stopGame(roomId);
    }
    this._songStatsDb.incrementPlayCount(this._gameRooms.getRoom(roomId).state.dict.currentSong);
    await this._gameRooms.getRoom(roomId).state.startTimeout(10000);
    if (this._gameRooms.getRoom(roomId).state.continueNextRound()) {
      this._gameRooms.getRoom(roomId).state.nextSong();
      await this._newRound(roomId, settings);
    } else {
      this._stopGame(roomId);
    }
  }

  protected _stopGame(roomId: TGameRoomId) {
    this._gameRooms.getRoom(roomId).state.stopGame();
    this._emitter.updateStoreGameState(roomId);
    this._emitter.stopGame(roomId);
  }
}

export { GameHandler };
