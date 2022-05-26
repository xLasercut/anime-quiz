import { AbstractHandler } from './abstract'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { ROOM_NAME_PREFIX } from '../constants'
import { v4 } from 'uuid'
import { ChatManager } from '../game/chat'
import { Server } from '../app/server'
import { ROOM_NAME_FORMAT } from '../shared/constants'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { GameSettings } from '../game/settings'
import { AnimeQuizUserDb } from '../database/user'
import { AnimeQuizSongDb } from '../database/song'
import { AqGameGuess } from '../shared/interfaces'

class GameHandler extends AbstractHandler {
  protected _io: Server
  protected _emitter: Emitter
  protected _chat: ChatManager
  protected _settings: GameSettings
  protected _userDb: AnimeQuizUserDb
  protected _songDb: AnimeQuizSongDb

  constructor(logger: Logger, io: Server, emitter: Emitter, userDb: AnimeQuizUserDb, songDb: AnimeQuizSongDb, settings: GameSettings) {
    super(logger)
    this._io = io
    this._emitter = emitter
    this._chat = new ChatManager(logger)
    this._settings = settings
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
