import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { ChatManager } from '../game/chat'
import { Server } from '../app/server'
import { GAME_MODE, NOTIFICATION_COLOR, ROOM_NAME_FORMAT } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { GameSettings } from '../game/settings'
import { AnimeQuizUserDb } from '../database/user'
import { AnimeQuizSongDb } from '../database/song'
import { AqGameGuess, AqGameSettings, AqSong } from '../shared/interfaces'
import { GameStates } from '../game/state'

class GameHandler extends AbstractHandler {
  protected _io: Server
  protected _emitter: Emitter
  protected _chat: ChatManager
  protected _settings: GameSettings
  protected _states: GameStates
  protected _userDb: AnimeQuizUserDb
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, io: Server, emitter: Emitter, userDb: AnimeQuizUserDb, songDb: AnimeQuizSongDb, settings: GameSettings, states: GameStates) {
    super(logger)
    this._io = io
    this._emitter = emitter
    this._chat = new ChatManager(logger)
    this._settings = settings
    this._states = states
    this._userDb = userDb
    this._songDb = songDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, async (roomName: string, callback: Function) => {
      try {
        this._validateNewRoomName(roomName)
        const roomId = `${ROOM_NAME_PREFIX}|${roomName}|${v4()}`
        this._emitter.updateSongListData(
          await this._songDb.getAllSongList(),
          await this._songDb.getAnimeList(),
          await this._songDb.getSongTitleList(),
          await this._userDb.getUserLists(),
          socket.id
        )
        socket.data.host = true
        this._emitter.updateClientData(socket.data.getClientData(), socket.id)
        socket.join(roomId)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.JOIN_GAME_ROOM, async (roomName: string, callback: Function) => {
      try {
        this._validateExistingRoomName(roomName)
        this._emitter.updateSongListData(
          await this._songDb.getAllSongList(),
          await this._songDb.getAnimeList(),
          await this._songDb.getSongTitleList(),
          await this._userDb.getUserLists(),
          socket.id
        )
        socket.data.host = false
        this._emitter.updateClientData(socket.data.getClientData(), socket.id)
        socket.join(roomName)
        callback(true)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GAME_CHAT, (message: string) => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        this._emitter.updateGameChat(this._chat.generateUserMsg(socket, message), roomId)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.EDIT_GUESS, (guess: AqGameGuess) => {
      try {
        socket.data.gameGuess = guess
        this._emitter.updateGuess(socket.data.gameGuess, socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.START_GAME, async () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        const settings = this._settings.getGameSettings(roomId)
        const gameList = await this._generateGameList(settings)
        this._validateGameSongList(gameList)
        this._states.startGame(roomId, gameList)
        const gameState = this._states.getGameState(roomId)
        this._emitter.updateGameState(gameState, roomId)
        this._io.resetScore(roomId)
        this._emitter.updateGamePlayerList(this._io.getPlayerList(roomId), roomId)
        this._logger.writeLog(LOG_BASE.GAME001, {
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
        this._states.stopGame(roomId)
        this._emitter.updateGameState(this._states.getGameState(roomId), roomId)
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

  protected async _newRound(roomId: string, settings: AqGameSettings): Promise<void> {
    const startPosition = Math.random()
    const gameState = this._states.getGameState(roomId)
    this._emitter.updateGameState(gameState, roomId)
    this._io.newRound(roomId)
    this._emitter.gameStartLoad(startPosition, settings.guessTime, roomId)
    await this._states.waitPlayerLoaded(30000, roomId)
    this._emitter.gameStartCountdown(settings.guessTime, roomId)
  }

  protected async _generateGameList(settings: AqGameSettings): Promise<AqSong[]> {
    if (settings.gameMode === GAME_MODE.NORMAL) {
      return await this._generateNormalGameList(settings)
    }
  }

  protected async _generateNormalGameList(settings: AqGameSettings): Promise<AqSong[]> {
    const userSongIds = await this._userDb.getSelectedUserSongIds(settings.users)
    const userSongs = await this._songDb.getSelectedUserSongs(userSongIds)
    if (settings.duplicate) {
      return userSongs.slice(0, settings.songCount)
    }
    let animeIds = []
    const dedupedSongList = []
    for (const song of userSongs) {
      if (!this._isDupeAnime(animeIds, song)) {
        dedupedSongList.push(song)
        animeIds = animeIds.concat(song.anime_id)
        if (dedupedSongList.length >= settings.songCount) {
          return dedupedSongList
        }
      }
    }
    return dedupedSongList
  }

  protected _isDupeAnime(animeIds: string[], song: AqSong): boolean {
    for (const animeId of song.anime_id) {
      if (animeIds.includes(animeId)) {
        return true
      }
    }
    return false
  }

  protected _validateGameSongList(songList: AqSong[]): void {
    if (songList.length === 0) {
      throw new GameDataValidationError('Empty song list')
    }
  }

  protected _validateNewRoomName(roomName: string): void {
    if (!ROOM_NAME_FORMAT.test(roomName)) {
      this._logger.writeLog(LOG_BASE.ROOM002, { roomName: roomName })
      throw new GameDataValidationError('Invalid room name')
    }
  }

  protected _validateExistingRoomName(roomId: string): void {
    if (!this._io.isGameRoomExists(roomId)) {
      this._logger.writeLog(LOG_BASE.ROOM001, { roomName: roomId })
      throw new GameDataValidationError('Room does not exist')
    }
  }
}

export {
  GameHandler
}
