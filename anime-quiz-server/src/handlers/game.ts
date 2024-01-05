import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { GameListGeneratorFactory } from '../game-state/game-list-generator';
import { Socket } from '../types';
import { HandlerDependencies } from '../interfaces';
import { GameGuessType, GameRoomIdType, GameRoomSettingsType } from '../shared/models/types';
import { GameGuess } from '../shared/models/game';

class GameHandler extends ServerHandler {
  protected _generatorFactory: GameListGeneratorFactory;

  constructor(socket: Socket, errHandler: Function, dependencies: HandlerDependencies) {
    super(socket, errHandler, dependencies);
    this._generatorFactory = new GameListGeneratorFactory(dependencies.userSongDb, dependencies.songDb);
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
      this._emitter.gameNewRound(roomId);
      this._emitter.updateStoreGameState(roomId);
      this._gameRooms.getRoom(roomId).state.resetScore();
      this._emitter.updateStorePlayerList(roomId);
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
    [SOCKET_EVENTS.GAME_EDIT_GUESS]: (_guess: GameGuessType) => {
      const gameGuess = GameGuess.parse(_guess);
      const roomId = this._socket.data.currentGameRoom;
      this._socket.data.gameGuess = gameGuess;
      this._socket.data.pendingScore = this._gameRooms.getRoom(roomId).state.calculateScore(gameGuess);
      this._emitter.updateStoreGameGuess(gameGuess, this._socket.id);
    }
  };

  protected async _newRound(roomId: GameRoomIdType, settings: GameRoomSettingsType) {
    const startPosition = Math.random();
    this._emitter.gameNewRound(roomId);
    this._emitter.updateStoreGameState(roomId);
    await this._gameRooms.getRoom(roomId).state.startTimeout(2000);
    this._gameRooms.getRoom(roomId).state.newRound();
    this._emitter.gameStartLoad(roomId, startPosition, settings.guessTime);
    this._gameRooms.getRoom(roomId).state.songOverride = undefined;
    await this._gameRooms.getRoom(roomId).state.waitPlayerLoaded(10000);
    this._emitter.gameStartCountdown(roomId);
    await this._gameRooms.getRoom(roomId).state.startTimeout(settings.guessTime * 1000);
    this._gameRooms.getRoom(roomId).state.updateScore();
    this._emitter.updateStorePlayerList(roomId);
    this._emitter.gameShowGuess(roomId);
    if (!this._gameRooms.getRoom(roomId).state.isLastSong()) {
      this._gameRooms.getRoom(roomId).state.nextSong();
      await this._gameRooms.getRoom(roomId).state.startTimeout(10000);
      await this._newRound(roomId, settings);
    } else {
      this._stopGame(roomId);
    }
  }

  protected _stopGame(roomId: GameRoomIdType) {
    this._gameRooms.getRoom(roomId).state.stopGame();
    this._emitter.updateStoreGameState(roomId);
    this._emitter.stopGame(roomId);
  }
}

export { GameHandler };
