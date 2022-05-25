import { createServer } from 'http'
import { Server } from 'socket.io'
import { ServerConfig } from './app/config'
import { Logger } from './app/logging/logger'
import { newErrorHandler } from './app/exceptions'
import { SocketData } from './app/socket-data'
import { Socket } from './types'
import { LOG_BASE } from './app/logging/log-base'
import { SHARED_EVENTS } from './shared/events'
import { Emitter } from './app/emitter'
import { checkClientAuth, authenticateUser } from './app/authentication'
import { NOTIFICATION_COLOR } from './shared/constants'
import { AnimeQuizSongDb } from './database/song'
import { SongListHandler } from './handlers/song-list'
import { RoomHandler } from './handlers/room'
import { AnimeQuizUserDb } from './database/user'
import { GameHandler } from './handlers/game'
import { GameController } from './game/controller'
import { ChatManager } from './game/chat'

const config = new ServerConfig()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: config.corsConfig
  }
})

const emitter = new Emitter(io)
const logger = new Logger(config)
const songDb = new AnimeQuizSongDb(config, logger)
const userDb = new AnimeQuizUserDb(config, logger)
const gameController = new GameController(logger, io)
const chatManager = new ChatManager(logger)

const songListHandler = new SongListHandler(logger, emitter, songDb, userDb)
const roomHandler = new RoomHandler(logger, gameController, emitter)
const gameHandler = new GameHandler(logger, gameController, emitter, chatManager)

function startHandlers(socket: Socket, errorHandler: Function): void {
  if (socket.data.auth) {
    songListHandler.start(socket, errorHandler)
    roomHandler.start(socket, errorHandler)
    gameHandler.start(socket, errorHandler)
  }
}

io.on('connection', (socket: Socket) => {
  logger.writeLog(LOG_BASE.SERVER002, { id: socket.id })
  const errorHandler = newErrorHandler(socket, logger, emitter)
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
      logger.writeLog(LOG_BASE.SERVER003, { id: socket.id })
      clearTimeout(socket.data.clientAuthTimer)
      gameController.syncRoomStates()
    } catch (e) {
      errorHandler(e)
    }
  })
})

httpServer.listen(config.serverPort, async () => {
  logger.writeLog(LOG_BASE.SERVER001, { port: config.serverPort })
})
