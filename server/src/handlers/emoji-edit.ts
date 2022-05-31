import { AbstractHandler } from './abstract'
import { AnimeQuizMainDb } from '../database/main'
import { Logger } from '../app/logging/logger'
import { Emitter } from '../app/emitter'
import { Socket } from '../types'

class EmojiEditHandler extends AbstractHandler {
  protected _mainDb: AnimeQuizMainDb

  constructor(logger: Logger, emitter: Emitter, mainDb: AnimeQuizMainDb) {
    super(logger, emitter)
    this._mainDb = mainDb
  }

  public start(socket: Socket, errorHandler: Function) {

  }
}

export {
  EmojiEditHandler
}
