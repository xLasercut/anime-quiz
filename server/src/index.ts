import { createServer } from 'http'
import { ServerConfig } from './app/config'
import { Logger } from './app/logging/logger'
import { newIoErrorHandler, newSocketErrorHandler } from './app/exceptions'
import { SocketData } from './app/socket-data'
import { Socket } from './types'
import { LOG_BASE } from './app/logging/log-base'
import { SHARED_EVENTS } from './shared/events'
import { Emitter } from './app/emitter'
import { authenticateUser, checkClientAuth } from './app/authentication'
import { NOTIFICATION_COLOR } from './shared/constants'
import { SongListHandler } from './handlers/song-list'
import { RoomHandler } from './handlers/room'
import { AnimeQuizUserDb } from './database/user'
import { GameHandler } from './handlers/game'
import { GameSettings } from './game/settings'
import { isGameRoom } from './helpers'
import { Server } from './app/server'
import { GameSettingsHandler } from './handlers/settings'
import { GameStates } from './game/state'
import { AnimeEditHandler } from './handlers/anime-edit'
import { SongEditHandler } from './handlers/song-edit'
import { AdminHandler } from './handlers/admin'
import { ChatManager } from './game/chat'
import { EmojiEditHandler } from './handlers/emoji-edit'
import { AnimeQuizEmojiDb } from './database/emoji'
import { AnimeQuizSongDb } from './database/song'

const config = new ServerConfig()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: config.corsConfig
  }
})

const emitter = new Emitter(io)
const logger = new Logger(config)
const userDb = new AnimeQuizUserDb(config, logger)
const emojiDb = new AnimeQuizEmojiDb(config, logger)
const songDb = new AnimeQuizSongDb(config, logger)
const gameSettings = new GameSettings(logger)
const gameStates = new GameStates(logger, io)
const chatManager = new ChatManager(logger)

const ioErrorHandler = newIoErrorHandler(logger)

const animeEditHandler = new AnimeEditHandler(logger, emitter, songDb)
const songEditHandler = new SongEditHandler(logger, emitter, songDb, userDb)
const adminHandler = new AdminHandler(logger, emitter, io, songDb, emojiDb)
const emojiEditHandler = new EmojiEditHandler(logger, emitter, emojiDb)
const songListHandler = new SongListHandler(logger, emitter, songDb, userDb)
const roomHandler = new RoomHandler(logger, io, emitter)
const gameSettingsHandler = new GameSettingsHandler(logger, gameSettings, io, emitter, chatManager)
const gameHandler = new GameHandler(
  logger,
  io,
  emitter,
  userDb,
  songDb,
  emojiDb,
  gameSettings,
  gameStates,
  chatManager
)

function startHandlers(socket: Socket, errorHandler: Function): void {
  if (socket.data.auth) {
    songListHandler.start(socket, errorHandler)
    roomHandler.start(socket, errorHandler)
    gameHandler.start(socket, errorHandler)
    gameSettingsHandler.start(socket, errorHandler)
    if (socket.data.admin) {
      animeEditHandler.start(socket, errorHandler)
      songEditHandler.start(socket, errorHandler)
      adminHandler.start(socket, errorHandler)
      emojiEditHandler.start(socket, errorHandler)
    }
    emitter.updateClientData(socket.data.getClientData(), socket.id)
  }
}

io.on('connection', (socket: Socket) => {
  logger.writeLog(LOG_BASE.NEW_CONNECTION, { id: socket.id })
  const errorHandler = newSocketErrorHandler(socket, logger, emitter)
  socket.data = new SocketData(socket.id)
  socket.data.clientAuthTimer = setTimeout((): void => {
    checkClientAuth(logger, socket)
  }, config.clientAuthDelay)

  socket.on(SHARED_EVENTS.AUTHENTICATE, (username: string, password: string, avatar: string, callback: Function) => {
    try {
      authenticateUser(socket, username, password, avatar, config)
      startHandlers(socket, errorHandler)
      if (!socket.data.auth) {
        emitter.systemNotification(NOTIFICATION_COLOR.ERROR, 'Incorrect server password', socket.id)
      }
      callback(socket.data.auth)
    } catch (e) {
      errorHandler(e)
    }
  })

  socket.on('disconnect', async () => {
    try {
      logger.writeLog(LOG_BASE.CLIENT_DISCONNECTED, { id: socket.id })
      clearTimeout(socket.data.clientAuthTimer)
    } catch (e) {
      errorHandler(e)
    }
  })
})

io.of('/').adapter.on('create-room', (roomId: string) => {
  try {
    if (isGameRoom(roomId)) {
      gameSettings.addRoom(roomId)
      gameStates.addRoom(roomId)
      emitter.updateRoomList(io.getGameRoomList())
    }
  } catch (e) {
    ioErrorHandler(e)
  }
})

io.of('/').adapter.on('delete-room', (roomId: string) => {
  try {
    if (isGameRoom(roomId)) {
      gameSettings.deleteRoom(roomId)
      gameStates.deleteRoom(roomId)
      emitter.updateRoomList(io.getGameRoomList())
    }
  } catch (e) {
    ioErrorHandler(e)
  }
})

io.of('/').adapter.on('join-room', (roomId: string, sid: string) => {
  try {
    const socket = io.sockets.sockets.get(sid)
    logger.writeLog(LOG_BASE.JOINED_ROOM, {
      id: sid,
      username: socket.data.username,
      roomId: roomId
    })
    if (isGameRoom(roomId)) {
      emitter.updateGamePlayerList(io.getPlayerList(roomId), roomId)
      const chatMsg = chatManager.generateSysMsg(`${socket.data.username} joined the room`)
      emitter.updateGameChat(chatMsg, roomId)
    }
  } catch (e) {
    ioErrorHandler(e)
  }
})

io.of('/').adapter.on('leave-room', (roomId: string, sid: string) => {
  try {
    const socket = io.sockets.sockets.get(sid)
    logger.writeLog(LOG_BASE.LEAVE_ROOM, {
      id: sid,
      username: socket.data.username,
      roomId: roomId
    })
    if (isGameRoom(roomId)) {
      io.reassignHost(roomId)
      emitter.updateGamePlayerList(io.getPlayerList(roomId), roomId)
      const chatMsg = chatManager.generateSysMsg(`${socket.data.username} left the room`)
      emitter.updateGameChat(chatMsg, roomId)
    }
  } catch (e) {
    ioErrorHandler(e)
  }
})

httpServer.listen(config.serverPort, async () => {
  try {
    logger.writeLog(LOG_BASE.SERVER_RUNNING, { port: config.serverPort })
    await userDb.startBackTask()
  } catch (e) {
    throw e
  }
})
