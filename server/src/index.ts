import { createServer } from 'http'
import { ServerConfig } from './app/config'
import { Logger } from './app/logging/logger'
import { newIoErrorHandler, newSocketErrorHandler } from './app/exceptions'
import { SocketData } from './app/socket-data'
import { Socket } from './types'
import { LOG_BASE } from './app/logging/log-base'
import { SHARED_EVENTS } from './shared/events'
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
import { EmojiEditHandler } from './handlers/emoji-edit'
import { AnimeQuizEmojiDb } from './database/emoji'
import { AnimeQuizSongDb } from './database/song'
import { UserEditHandler } from './handlers/user-edit'
import { AqDataHandler } from './handlers/data'
import { SongDbEmitter } from './emitters/song'
import { SystemEmitter } from './emitters/system'
import { EmojiDbEmitter } from './emitters/emoji'
import { UserDbEmitter } from './emitters/user'
import { RoomEmitter } from './emitters/room'
import { GameEmitter } from './emitters/game'
import { GameListGeneratorFactory } from './game/generator/factory'

const config = new ServerConfig()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: config.corsConfig
  }
})

const logger = new Logger(config)
const userDb = new AnimeQuizUserDb(config, logger)
const emojiDb = new AnimeQuizEmojiDb(config, logger)
const songDb = new AnimeQuizSongDb(config, logger)
const gameSettings = new GameSettings(logger)
const gameStates = new GameStates(logger, io)

const songDbEmitter = new SongDbEmitter(io, songDb)
const systemEmitter = new SystemEmitter(io)
const emojiDbEmitter = new EmojiDbEmitter(io, emojiDb)
const userDbEmitter = new UserDbEmitter(io, userDb)
const roomEmitter = new RoomEmitter(io)
const gameEmitter = new GameEmitter(io, logger, gameSettings, gameStates)

const ioErrorHandler = newIoErrorHandler(logger)

const aqDataHandler = new AqDataHandler(logger, songDbEmitter, emojiDbEmitter, userDbEmitter)

const animeEditHandler = new AnimeEditHandler(logger, systemEmitter, songDb, songDbEmitter)
const songEditHandler = new SongEditHandler(logger, songDb, userDb, songDbEmitter, systemEmitter)
const adminHandler = new AdminHandler(logger, systemEmitter, io, songDb, emojiDb, userDb, gameStates)
const emojiEditHandler = new EmojiEditHandler(logger, emojiDb, emojiDbEmitter, systemEmitter)
const userEditHandler = new UserEditHandler(logger, userDb, userDbEmitter, systemEmitter)


const songListHandler = new SongListHandler(logger, songDb, userDb, songDbEmitter, userDbEmitter, systemEmitter)
const roomHandler = new RoomHandler(logger, roomEmitter)
const gameSettingsHandler = new GameSettingsHandler(logger, gameSettings, gameEmitter)
const gameListGeneratorFactory = new GameListGeneratorFactory(songDb, userDb)
const gameHandler = new GameHandler(
  logger,
  io,
  gameSettings,
  gameStates,
  userDbEmitter,
  songDbEmitter,
  emojiDbEmitter,
  gameEmitter,
  systemEmitter,
  gameListGeneratorFactory
)

function startHandlers(socket: Socket, errorHandler: Function): void {
  if (socket.data.auth) {
    songListHandler.start(socket, errorHandler)
    roomHandler.start(socket, errorHandler)
    gameHandler.start(socket, errorHandler)
    gameSettingsHandler.start(socket, errorHandler)
    aqDataHandler.start(socket, errorHandler)
    if (socket.data.admin) {
      animeEditHandler.start(socket, errorHandler)
      songEditHandler.start(socket, errorHandler)
      adminHandler.start(socket, errorHandler)
      emojiEditHandler.start(socket, errorHandler)
      userEditHandler.start(socket, errorHandler)
    }
    systemEmitter.updateClientData(socket.data.getClientData(), socket.id)
  }
}

io.on('connection', (socket: Socket) => {
  logger.writeLog(LOG_BASE.NEW_CONNECTION, { id: socket.id })
  const errorHandler = newSocketErrorHandler(socket, logger, systemEmitter)
  socket.data = new SocketData(socket.id)
  socket.data.clientAuthTimer = setTimeout((): void => {
    checkClientAuth(logger, socket)
  }, config.clientAuthDelay)

  socket.on(SHARED_EVENTS.AUTHENTICATE, (username: string, password: string, avatar: string, callback: Function) => {
    try {
      authenticateUser(socket, username, password, avatar, config)
      startHandlers(socket, errorHandler)
      if (!socket.data.auth) {
        systemEmitter.systemNotification(NOTIFICATION_COLOR.ERROR, 'Incorrect server password', socket.id)
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
      roomEmitter.updateRoomList()
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
      roomEmitter.updateRoomList()
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
      gameEmitter.updateGamePlayerList(roomId, roomId)
      gameEmitter.updateGameState(roomId, sid)
      gameEmitter.updateGameChatSys(`${socket.data.username} joined the room`, roomId)
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
      gameEmitter.updateGamePlayerList(roomId, roomId)
      gameEmitter.updateGameChatSys(`${socket.data.username} left the room`, roomId)
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
