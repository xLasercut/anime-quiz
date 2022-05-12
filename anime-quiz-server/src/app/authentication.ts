import { Socket } from '../types'
import { ServerConfig } from './config'
import { Logger } from './logging/logger'
import { LOG_BASE } from './logging/log-base'

function checkPassword(socket: Socket, username: string, password: string, config: ServerConfig): void {
  if (password === config.serverPassword || password === config.adminPassword) {
    socket.data.userLogin(username)
    socket.data.auth = true
  }
  if (password === config.adminPassword) {
    socket.data.admin = true
  }
}

function checkClientAuth(logger: Logger, socket: Socket): void {
  if (!socket.data.auth) {
    logger.writeLog(LOG_BASE.AUTH002, { id: socket.id })
    socket.disconnect()
  }
}

export {
  checkPassword,
  checkClientAuth
}
