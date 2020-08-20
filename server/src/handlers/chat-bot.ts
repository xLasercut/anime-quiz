import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {ChatBotDatabase} from '../database/chat-bot'
import {ROOM_IDS} from '../config'

class ChatBotHandler extends AbstractHandler {
  protected _chatBotDatabase: ChatBotDatabase
  protected _roomId = ROOM_IDS.chatBotList

  constructor(logger: Logger, emitter: Emitter, chatBotDatabase: ChatBotDatabase) {
    super(logger, emitter)
    this._chatBotDatabase = chatBotDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('JOIN_CHAT_BOT', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      socket.join(this._roomId)
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList(), socket.id)
    }))

    socket.on('GET_CHAT_BOT_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.CHAT001, {id: socket.id})
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList(), socket.id)
    }))
  }
}


export {ChatBotHandler}
