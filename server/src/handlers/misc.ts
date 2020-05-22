import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {EmojiDatabase} from '../database/emoji'
import {ISocket} from '../interfaces'

class MiscHandler extends AbstractHandler {
  protected _emojiDatabase: EmojiDatabase
  protected _roomId = 'misc'

  constructor(logger: Logger, emitter: Emitter, emojiDatabase: EmojiDatabase) {
    super(logger, emitter)
    this._emojiDatabase = emojiDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('LOGIN_MISC', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, service: this._roomId})
      socket.join(this._roomId)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
    }))
  }
}


export {MiscHandler}
