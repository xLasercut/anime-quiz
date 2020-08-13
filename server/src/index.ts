import {LOG_BASE, Logger} from './app/logging'
import * as socketio from 'socket.io'
import * as express from 'express'
import {ADMIN_PASSWORD, SERVER_PASSWORD, SERVER_PORT} from './config'
import {ISocket} from './interfaces'
import {AuthError, ServerDataError} from './exceptions'
import {Emitter} from './app/emitter'
import {AmqSongDatabase} from './database/amq-song'
import {AmqUserSongDatabase} from './database/amq-user-song'
import {AmqSongListHandler} from './handlers/amq-song-list'
import {AdminHandler} from './handlers/admin'
import {AmqHandler} from './handlers/amq'
import {EmojiDatabase} from './database/emoji'
import {ChatBotHandler} from './handlers/chat-bot'
import {ChatBotDatabase} from './database/chat-bot'
import {ChatManager} from './game/chat'
import {EmojiHandler} from './handlers/emoji'
import {AmqGameController} from './game/controllers/amq'
import {GeneralGameHandler} from './handlers/room'


const logger = new Logger()

const app = express()
const server = app.listen(SERVER_PORT, () => {
  logger.writeLog(LOG_BASE.SERVER001, {port: SERVER_PORT})
})

const io = socketio(server)
const emitter = new Emitter(io)

const amqSongDatabase = new AmqSongDatabase()
const amqUserSongDatabase = new AmqUserSongDatabase(amqSongDatabase)
const emojiDatabase = new EmojiDatabase()
const chatBotDatabase = new ChatBotDatabase()

const chatManager = new ChatManager(logger, chatBotDatabase, emojiDatabase)
const amqGameController = new AmqGameController(io)

const generalGameHandler = new GeneralGameHandler(logger, emitter)
const amqSongListHandler = new AmqSongListHandler(logger, emitter, amqSongDatabase, amqUserSongDatabase)
const emojiHandler = new EmojiHandler(logger, emitter, emojiDatabase)
const chatBotHandler = new ChatBotHandler(logger, emitter, chatBotDatabase)
const adminHandler = new AdminHandler(io, logger, emitter, amqSongDatabase, amqUserSongDatabase, emojiDatabase, chatBotDatabase)

const amqHandler = new AmqHandler(io, logger, emitter, amqGameController, chatManager, amqSongDatabase, amqUserSongDatabase, emojiDatabase)


io.on('connect', (socket: ISocket) => {
  logger.writeLog(LOG_BASE.SERVER002, {id: socket.id})
  socket.admin = false
  socket.auth = false
  socket.timer = setTimeout((): void => {
    checkClientAuth(socket)
  }, 2000)

  socket.on('AUTHENTICATE', exceptionHandler(socket, (password: string, callback: Function): void => {
    checkPassword(socket, password)
    startHandlers(socket)
    if (!socket.auth) {
      emitter.systemNotification('error', 'Incorrect server password')
    }
    callback(socket.auth)
  }))

  socket.on('disconnect', exceptionHandler(socket, (): void => {
    logger.writeLog(LOG_BASE.SERVER003, {id: socket.id})
    clearTimeout(socket.timer)
  }))
})

function startHandlers(socket: ISocket): void {
  if (socket.auth) {
    generalGameHandler.start(socket, exceptionHandler)
    amqSongListHandler.start(socket, exceptionHandler)
    emojiHandler.start(socket, exceptionHandler)
    chatBotHandler.start(socket, exceptionHandler)
    amqHandler.start(socket, exceptionHandler)

    if (socket.admin) {
      emitter.updateAdmin(socket.admin, socket.id)
      adminHandler.start(socket, exceptionHandler)
    }
  }
}

function exceptionHandler(socket: ISocket, f: Function): any {
  return function () {
    try {
      return f.apply(this, arguments)
    } catch (e) {
      if (e instanceof ServerDataError) {
        logger.writeLog(LOG_BASE.DATA001, {reason: e.message})
        emitter.systemNotification('error', e.message, socket.id)
      }
      else if (e instanceof AuthError) {
        logger.writeLog(LOG_BASE.AUTH003, {id: socket.id})
        emitter.systemNotification('error', e.message, socket.id)
        socket.disconnect()
      }
      else {
        logger.writeLog(LOG_BASE.SERVER004, {stack: e.stack})
      }
    }
  }
}

function checkPassword(socket: ISocket, password: string): void {
  if (password === SERVER_PASSWORD || password === ADMIN_PASSWORD) {
    socket.auth = true
  }
  if (password === ADMIN_PASSWORD) {
    socket.admin = true
  }
}

function checkClientAuth(socket: ISocket): void {
  if (!socket.auth) {
    logger.writeLog(LOG_BASE.AUTH002, {id: socket.id})
    socket.disconnect()
  }
}
