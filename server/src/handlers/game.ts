import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { ChatManager } from '../game/chat'
import { Server } from '../app/server'
import { GAME_MODE, ROOM_NAME_FORMAT } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { GameSettings } from '../game/settings'
import { AnimeQuizUserDb } from '../database/user'
import { AqGameGuess, AqGameSettings, AqSong } from '../shared/interfaces'
import { GameStates } from '../game/state'
import { AnimeQuizEmojiDb } from '../database/emoji'
import { AnimeQuizSongDb } from '../database/song'
import { shuffleSongList } from '../helpers'

class GameHandler extends AbstractHandler {
  protected _io: Server
  protected _chat: ChatManager
  protected _settings: GameSettings
  protected _states: GameStates
  protected _userDb: AnimeQuizUserDb
  protected _songDb: AnimeQuizSongDb
  protected _emojiDb: AnimeQuizEmojiDb

  constructor(
    logger: Logger,
    io: Server,
    emitter: Emitter,
    userDb: AnimeQuizUserDb,
    sonDb: AnimeQuizSongDb,
    emojiDb: AnimeQuizEmojiDb,
    settings: GameSettings,
    states: GameStates,
    chatManager: ChatManager
  ) {
    super(logger, emitter)
    this._io = io
    this._chat = chatManager
    this._settings = settings
    this._states = states
    this._userDb = userDb
    this._songDb = sonDb
    this._emojiDb = emojiDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.NEW_GAME_ROOM, (roomName: string, callback: Function) => {
      try {
        this._validateNewRoomName(roomName)
        const roomId = `${ROOM_NAME_PREFIX}|${roomName}|${v4()}`
        this._emitter.updateAnimeList(this._songDb.getAnimeList(), socket.id)
        this._emitter.updateSongTitleList(this._songDb.getSongTitleList(), socket.id)
        this._emitter.updateUserLists(this._userDb.getUserLists(), socket.id)
        this._emitter.updateEmojiList(this._emojiDb.getEmojiList(), socket.id)
        socket.data.host = true
        this._emitter.updateClientData(socket.data.getClientData(), socket.id)
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
        this._emitter.updateAnimeList(this._songDb.getAnimeList(), socket.id)
        this._emitter.updateSongTitleList(this._songDb.getSongTitleList(), socket.id)
        this._emitter.updateUserLists(this._userDb.getUserLists(), socket.id)
        this._emitter.updateEmojiList(this._emojiDb.getEmojiList(), socket.id)
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
        const roomId = this._getSocketGameRoom(socket)
        const _guess = this._sanitiseGuess(guess)
        socket.data.gameGuess = _guess
        socket.data.pendingScore = this._states.calculateScore(_guess, roomId)
        this._emitter.updateGuess(socket.data.gameGuess, socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.START_GAME, async () => {
      try {
        const roomId = this._getSocketGameRoom(socket)
        const settings = this._settings.getGameSettings(roomId)
        const gameList = shuffleSongList(this._generateGameList(settings))
        this._validateGameSongList(gameList)
        this._states.startGame(roomId, gameList)
        const gameState = this._states.getGameState(roomId)
        this._emitter.updateGameState(gameState, roomId)
        this._io.resetScore(roomId)
        this._emitter.updateGamePlayerList(this._io.getPlayerList(roomId), roomId)
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
    this._emitter.gameNewRound(roomId)
    this._io.newRound(roomId)
    this._emitter.updateGameState(gameState, roomId)
    await this._states.startTimeout(2000, roomId)
    this._emitter.gameStartLoad(startPosition, settings.guessTime, roomId)
    await this._states.waitPlayerLoaded(10000, roomId)
    this._emitter.gameStartCountdown(roomId)
    await this._states.startTimeout(settings.guessTime * 1000, roomId)
    this._io.updateScore(roomId)
    this._emitter.updateGamePlayerList(this._io.getPlayerList(roomId), roomId)
    this._emitter.gameShowGuess(roomId)
    if (!this._states.isLastSong(roomId)) {
      await this._states.startTimeout(10000, roomId)
      this._states.nextSong(roomId)
      await this._newRound(roomId, settings)
    }
    else {
      this._stopGame(roomId)
    }
  }

  protected _stopGame(roomId: string): void {
    this._states.stopGame(roomId)
    this._emitter.updateGameState(this._states.getGameState(roomId), roomId)
    this._emitter.stopClientGame(roomId)
  }

  protected _generateGameList(settings: AqGameSettings): AqSong[] {
    if (settings.gameMode === GAME_MODE.BALANCED) {
      return this._generateBalancedGameList(settings)
    }
    return this._generateNormalGameList(settings)
  }

  protected _generateBalancedGameList(settings: AqGameSettings): AqSong[] {
    const userLists = this._userDb.getSelectedUserLists(settings.users)
    if (userLists.length <= 0) {
      return []
    }
    const songIds = new Set()
    let animeIds = []
    const songList = []
    const songsPerUser = Math.floor(settings.songCount / userLists.length)
    for (const userList of userLists) {
      let songCount = 0
      const userSongs = this._songDb.getSelectedUserSongs(userList.song_id)
      for (const song of userSongs) {
        if (!songIds.has(song.song_id)) {
          if (settings.duplicate) {
            if (!this._isDupeAnime(animeIds, song)) {
              songList.push(song)
              songIds.add(song.song_id)
              animeIds = animeIds.concat(song.anime_id)
              songCount += 1
            }
          }
          else {
            songList.push(song)
            songIds.add(song.song_id)
            songCount += 1
          }
        }

        if (songCount >= songsPerUser) {
          break
        }
      }
    }
    return songList
  }

  protected _generateNormalGameList(settings: AqGameSettings): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(settings.users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
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

export {
  GameHandler
}
