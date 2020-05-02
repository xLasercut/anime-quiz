import * as socketio from 'socket.io'
import * as express from 'express'
import {LOG_BASE, Logger} from './logging'
import {SERVER_PORT} from '../config'


const logger = new Logger()
const app = express()
const server = app.listen(SERVER_PORT, () => {
  logger.writeLog(LOG_BASE.SERVER001, {port: SERVER_PORT})
})

const io = socketio(server)


export {io, logger}
