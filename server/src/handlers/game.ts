import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { Server } from '../app/server'
import { ROOM_NAME_FORMAT } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { GameSettings } from '../game/settings'
import { AqGameGuess, AqGameSettings, AqSong } from '../shared/interfaces'
import { GameStates } from '../game/state'
import { GameListGeneratorFactory } from '../game/generator/factory'
import { EmojiDbEmitter } from '../emitters/emoji'
import { GameEmitter } from '../emitters/game'
import { UserDbEmitter } from '../emitters/user'
import { SongDbEmitter } from '../emitters/song'
import { SystemEmitter } from '../emitters/system'

class GameHandler extends AbstractHandler {
  protected _io: Server
  protected _settings: GameSettings
  protected _states: GameStates
  protected _userDbEmitter: UserDbEmitter
  protected _songDbEmitter: SongDbEmitter
  protected _emojiDbEmitter: EmojiDbEmitter
  protected _gameEmitter: GameEmitter
  protected _systemEmitter: SystemEmitter
  protected _gameListGeneratorFactory: GameListGeneratorFactory

  constructor(
    logger: Logger,
    io: Server,
    settings: GameSettings,
    states: GameStates,
    userDbEmitter: UserDbEmitter,
    songDbEmitter: SongDbEmitter,
    emojiDbEmitter: EmojiDbEmitter,
    gameEmitter: GameEmitter,
    systemEmitter: SystemEmitter,
    gameListGeneratorFactory: GameListGeneratorFactory
  ) {
    super(logger)
    this._io = io
    this._settings = settings
    this._states = states
    this._userDbEmitter = userDbEmitter
    this._songDbEmitter = songDbEmitter
    this._emojiDbEmitter = emojiDbEmitter
    this._gameEmitter = gameEmitter
    this._systemEmitter = systemEmitter
    this._gameListGeneratorFactory = gameListGeneratorFactory
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateNewRoomName(roomName)
        const roomId = `${ROOM_NAME_PREFIX}|${roomName}|${v4()}`
        if (socket.data.admin) {
          this._songDbEmitter.updateSongList(socket.id)
        }
        this._songDbEmitter.updateAnimeList(socket.id)
        this._songDbEmitter.updateSongTitleList(socket.id)
        this._userDbEmitter.updateUserLists(socket.id)
        this._emojiDbEmitter.updateEmojiList(socket.id)
        socket.data.host = true
        this._systemEmitter.updateClientData(socket.data.getClientData(), socket.id)
        socket.join(roomId)
        callback(true)
      } catch (e) {
        errorHandler(e)
        callback(false)
      }
    })

    socket.on(SHARED_EVENTS.JOIN_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateExistingRoomName(roomName)
        if (socket.data.admin) {
          this._songDbEmitter.updateSongList(socket.id)
        }
        this._songDbEmitter.updateAnimeList(socket.id)
        this._songDbEmitter.updateSongTitleList(socket.id)
        this._userDbEmitter.updateUserLists(socket.id)
        this._emojiDbEmitter.updateEmojiList(socket.id)
        socket.data.host = false
        this._systemEmitter.updateClientData(socket.data.getClientData(), socket.id)
        socket.join(roomName)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GAME_CHAT, (message: string) => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._gameEmitter.updateGameChat(socket, message, roomId)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_GUESS, (guess: AqGameGuess) => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        const _guess = this._sanitiseGuess(guess)
        socket.data.gameGuess = _guess
        socket.data.pendingScore = this._states.calculateScore(_guess, roomId)
        this._gameEmitter.updateGuess(socket.data.gameGuess, socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.START_GAME, async () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        const settings = this._settings.getGameSettings(roomId)
        const gameList = this._generateGameList(settings)
        this._validateGameSongList(gameList)
        this._states.startGame(roomId, gameList)
        this._gameEmitter.gameNewRound(roomId)
        const gameState = this._states.getGameState(roomId)
        this._gameEmitter.updateGameState(roomId, roomId)
        this._io.resetScore(roomId)
        this._gameEmitter.updateGamePlayerList(roomId, roomId)
        this._logger.writeLog(LOG_BASE.NEW_GAME, {
          roomId: roomId,
          settings: settings,
          state: gameState
        })
        await this._newRound(roomId, settings)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.STOP_GAME, () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._stopGame(roomId)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GAME_SONG_LOADED, () => {
      try {
        socket.data.songLoaded = true
      } catch (e) {
        errorHandler(e)
      }
    })
  }

  protected _sanitiseGuess(guess: AqGameGuess): AqGameGuess {
    return {
      anime: (guess.anime || '').trim(),
      title: (guess.title || '').trim()
    }
  }

  protected async _newRound(roomId: string, settings: AqGameSettings): Promise<void> {
    const startPosition = Math.random()
    const gameState = this._states.getGameState(roomId)
    this._logger.writeLog(LOG_BASE.NEW_GAME_ROUND, { state: gameState, roomId: roomId })
    this._gameEmitter.gameNewRound(roomId)
    this._io.newRound(roomId)
    this._gameEmitter.updateGameState(roomId, roomId)
    await this._states.startTimeout(2000, roomId)
    this._gameEmitter.gameStartLoad(startPosition, settings.guessTime, roomId)
    this._states.clearSongOverride(roomId)
    await this._states.waitPlayerLoaded(10000, roomId)
    this._gameEmitter.gameStartCountdown(roomId)
    await this._states.startTimeout(settings.guessTime * 1000, roomId)
    this._io.updateScore(roomId)
    this._gameEmitter.updateGamePlayerList(roomId, roomId)
    this._gameEmitter.gameShowGuess(roomId)
    if (!this._states.isLastSong(roomId)) {
      this._states.nextSong(roomId)
      await this._states.startTimeout(10000, roomId)
      await this._newRound(roomId, settings)
    } else {
      this._stopGame(roomId)
    }
  }

  protected _stopGame(roomId: string): void {
    this._states.stopGame(roomId)
    this._gameEmitter.updateGameState(roomId, roomId)
    this._gameEmitter.stopClientGame(roomId)
  }

  protected _generateGameList(settings: AqGameSettings): AqSong[] {
    const generator = this._gameListGeneratorFactory.getGenerator(settings)
    return generator.generate()
  }

  protected _validateGameSongList(songList: AqSong[]): void {
    if (songList.length === 0) {
      throw new GameDataValidationError('Empty song list')
    }
  }

  protected _validateNewRoomName(roomName: string): void {
    if (!ROOM_NAME_FORMAT.test(roomName)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomName: roomName })
      throw new GameDataValidationError('Invalid room name')
    }
  }

  protected _validateExistingRoomName(roomId: string): void {
    if (!this._io.isGameRoomExists(roomId)) {
      this._logger.writeLog(LOG_BASE.ROOM_DATA_VALIDATION_FAILURE, { roomName: roomId })
      throw new GameDataValidationError('Room does not exist')
    }
  }
}

export { GameHandler }
