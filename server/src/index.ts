import {LOG_BASE, Logger} from './app/logging'
import * as socketio from 'socket.io'
import * as express from 'express'
import {ADMIN_PASSWORD, SERVER_PASSWORD, SERVER_PORT} from './config'
import {ISocket} from './interfaces'
import {AuthError, ServerDataError} from './exceptions'
import {Emitter} from './app/emitter'
import {SongDatabase} from './database/song'
import {UserSongDatabase} from './database/user-song'
import {ListPickerHandler} from './handlers/list-picker'
import {AdminHandler} from './handlers/admin'
import {MasterRoomManager} from './game/rooms/master'
import {AmqHandler} from './handlers/amq'
import {RoomHandler} from './handlers/room'
import {AmqRoomManager} from './game/rooms/amq'
import {EmojiDatabase} from './database/emoji'
import {MiscHandler} from './handlers/misc'


const logger = new Logger()

const app = express()
const server = app.listen(SERVER_PORT, () => {
  logger.writeLog(LOG_BASE.SERVER001, {port: SERVER_PORT})
})

const io = socketio(server)
const emitter = new Emitter(io)

const songDatabase = new SongDatabase()
const userSongDatabase = new UserSongDatabase(songDatabase)
const emojiDatabase = new EmojiDatabase()

const masterRoomManager = new MasterRoomManager(io)
const amqRoomManager = new AmqRoomManager(io)

const listPickerHandler = new ListPickerHandler(logger, emitter, songDatabase, userSongDatabase)
const miscHandler = new MiscHandler(logger, emitter, emojiDatabase)
const adminHandler = new AdminHandler(logger, emitter, songDatabase)

const roomHandler = new RoomHandler(logger, emitter, masterRoomManager)
const amqHandler = new AmqHandler(io, logger, emitter, amqRoomManager)


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
    listPickerHandler.start(socket, exceptionHandler)
    miscHandler.start(socket, exceptionHandler)
    roomHandler.start(socket, exceptionHandler)
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
