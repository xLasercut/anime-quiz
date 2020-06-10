import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {SongDatabase} from '../database/song'
import {ISocket} from '../interfaces'
import {IChatBot, IEmoji, ISong} from '../../../shared/interfaces/database'
import {AuthError} from '../exceptions'
import {EmojiDatabase} from '../database/emoji'
import {ChatBotDatabase} from '../database/chat-bot'

class AdminHandler extends AbstractHandler {
  protected _songDatabase: SongDatabase
  protected _emojiDatabase: EmojiDatabase
  protected _chatBotDatabase: ChatBotDatabase

  constructor(
    logger: Logger,
    emitter: Emitter,
    songDatabase: SongDatabase,
    emojiDatabase: EmojiDatabase,
    chatBotDatabase: ChatBotDatabase
  ) {
    super(logger, emitter)
    this._songDatabase = songDatabase
    this._emojiDatabase = emojiDatabase
    this._chatBotDatabase = chatBotDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('EDIT_GAME_SONG', exceptionHandler(socket, (song: ISong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'edit'}, song)
      )
      this._songDatabase.editSong(song)
      this._emitter.updateSongList(this._songDatabase.getSongList())
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} edited`, socket.id)
    }))

    socket.on('ADD_GAME_SONG', exceptionHandler(socket, (song: ISong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'add'}, song)
      )
      this._songDatabase.addSong(song)
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} added`, socket.id)
    }))

    socket.on('DELETE_GAME_SONG', exceptionHandler(socket, (song: ISong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'delete'}, song)
      )
      this._songDatabase.deleteSong(song)
      this._emitter.updateSongList(this._songDatabase.getSongList())
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} deleted`, socket.id)
    }))

    socket.on('EDIT_GAME_EMOJI', exceptionHandler(socket, (emoji: IEmoji): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.EMOJI002,
        Object.assign({}, {id: socket.id, operation: 'edit'}, emoji)
      )
      this._emojiDatabase.editEmoji(emoji)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList())
      this._emitter.systemNotification('success', `:${emoji.command}: edited`, socket.id)
    }))

    socket.on('DELETE_GAME_EMOJI', exceptionHandler(socket, (emoji: IEmoji): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.EMOJI002,
        Object.assign({}, {id: socket.id, operation: 'delete'}, emoji)
      )
      this._emojiDatabase.deleteEmoji(emoji)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList())
      this._emitter.systemNotification('success', `:${emoji.command}: deleted`, socket.id)
    }))

    socket.on('ADD_GAME_CHAT_BOT', exceptionHandler(socket, (chatBot: IChatBot): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.CHAT002,
        Object.assign({id: socket.id, operation: 'add'}, chatBot)
      )
      this._chatBotDatabase.addChatBot(chatBot)
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList())
      this._emitter.systemNotification('success', `${chatBot.regex} added`, socket.id)
    }))

    socket.on('EDIT_GAME_CHAT_BOT', exceptionHandler(socket, (chatBot: IChatBot): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.CHAT002,
        Object.assign({id: socket.id, operation: 'edit'}, chatBot)
      )
      this._chatBotDatabase.editChatBot(chatBot)
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList())
      this._emitter.systemNotification('success', `${chatBot.regex} edited`, socket.id)
    }))

    socket.on('DELETE_GAME_CHAT_BOT', exceptionHandler(socket, (chatBot: IChatBot): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.CHAT002,
        Object.assign({id: socket.id, operation: 'delete'}, chatBot)
      )
      this._chatBotDatabase.deleteChatBot(chatBot)
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList())
      this._emitter.systemNotification('success', `${chatBot.regex} deleted`, socket.id)
    }))
  }

  protected _checkAdminAuth(socket: ISocket): void {
    if (!socket.admin) {
      throw new AuthError('Invalid admin authentication')
    }
  }
}

export {AdminHandler}