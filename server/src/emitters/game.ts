import { AbstractEmitter } from './abstract';
import { SHARED_EVENTS } from '../shared/events';
import { Server } from '../app/server';
import { GameSettingsDb } from '../game/settings';
import { ChatManager } from '../game/chat';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { IGameGuess } from '../shared/interfaces';
import { GameStatesDb } from '../game/state';

class GameEmitter extends AbstractEmitter {
  protected _settings: GameSettingsDb;
  protected _chat: ChatManager;
  protected _states: GameStatesDb;

  constructor(io: Server, logger: Logger, settings: GameSettingsDb, states: GameStatesDb) {
    super(io);
    this._settings = settings;
    this._states = states;
    this._chat = new ChatManager(logger);
  }

  public updateGameSetting(roomId: string, sid: string): void {
    this._client(sid).emit(
      SHARED_EVENTS.UPDATE_GAME_SETTINGS,
      this._settings.getGameSettings(roomId)
    );
  }

  public updateGameChat(socket: ISocket, msg: string, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_CHAT, this._chat.generateUserMsg(socket, msg));
  }

  public updateGameChatSys(msg: string, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_CHAT, this._chat.generateSysMsg(msg));
  }

  public gameNewRound(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_NEW_ROUND);
  }

  public updateGuess(guess: IGameGuess, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GUESS, guess);
  }

  public updateGameState(roomId: string, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_STATE, this._states.getGameState(roomId));
  }

  public updateGamePlayerList(roomId: string, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_GAME_PLAYERS, this._io.getPlayerList(roomId));
  }

  public stopClientGame(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.STOP_CLIENT_GAME);
  }

  public gameStartLoad(startPosition: number, guessTime: number, sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_START_LOAD, startPosition, guessTime);
  }

  public gameStartCountdown(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_START_COUNTDOWN);
  }

  public gameShowGuess(sid: string): void {
    this._client(sid).emit(SHARED_EVENTS.GAME_SHOW_GUESS);
  }
}

export { GameEmitter };
