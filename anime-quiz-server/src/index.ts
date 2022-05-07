import {createServer} from 'http'
import {Server} from 'socket.io'
import {ServerConfig} from './app/config'
import {Logger} from './app/logging/logger'
import {newErrorHandler} from './app/exceptions'
import {SocketData} from './app/socket-data'
import {Socket} from './types'
import {LOG_BASE} from './app/logging/log-base'
import {SHARED_EVENTS} from './shared/events'
import {Emitter} from './app/emitter'

const config = new ServerConfig()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: config.corsConfig
  }
})

const emitter = new Emitter(io)
const logger = new Logger(config)

io.on('connection', (socket: Socket) => {
  logger.writeLog(LOG_BASE.SERVER002, { id: socket.id })
  const errorHandler = newErrorHandler(socket, logger)
  socket.data = new SocketData(socket.id)

  socket.on(SHARED_EVENTS.AUTHENTICATE, errorHandler(async (password: string) => {
    emitter.systemNotification('warning', 'test')
  }))

  socket.on('disconnect', errorHandler(async () => {
    logger.writeLog(LOG_BASE.SERVER003, { id: socket.id })
  }))
})

httpServer.listen(config.serverPort, (): void => {
  logger.writeLog(LOG_BASE.SERVER001, { port: config.serverPort })
})
