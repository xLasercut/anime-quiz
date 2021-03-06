import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {EmojiDatabase} from '../database/emoji'
import {ISocket} from '../interfaces'
import {IEmoji} from '../../../shared/interfaces/database'
import {ROOM_IDS} from '../config'

class EmojiHandler extends AbstractHandler {
  protected _emojiDatabase: EmojiDatabase
  protected _roomId = ROOM_IDS.emojiList

  constructor(logger: Logger, emitter: Emitter, emojiDatabase: EmojiDatabase) {
    super(logger, emitter)
    this._emojiDatabase = emojiDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('JOIN_EMOJI', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      socket.join(this._roomId)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
    }))

    socket.on('GET_EMOJI_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.EMOJI001, {id: socket.id})
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
    }))

    socket.on('ADD_GAME_EMOJI', exceptionHandler(socket, (emoji: IEmoji): void => {
      this._logger.writeLog(
        LOG_BASE.EMOJI002,
        Object.assign({}, {id: socket.id, operation: 'add'}, emoji)
      )
      this._emojiDatabase.addEmoji(emoji)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList())
      this._emitter.systemNotification('success', `:${emoji.command}: added`, socket.id)
    }))
  }
}


export {EmojiHandler}
