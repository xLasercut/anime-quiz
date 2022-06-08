import { AbstractHandler } from './abstract'
import { AnimeQuizUserDb } from '../database/user'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { ROOM_IDS } from '../constants'

class UserEditHandler extends AbstractHandler {
  protected _userDb: AnimeQuizUserDb

  constructor(logger: Logger, userDb: AnimeQuizUserDb) {
    super(logger)
    this._userDb = userDb
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.JOIN_USER_EDIT, () => {
      try {
        this._validateIsAdmin(socket)
        socket.join(ROOM_IDS.USER_EDIT)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export {
  UserEditHandler
}
