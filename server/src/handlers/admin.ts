import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {AmqSongDatabase} from '../database/amq-song'
import {ISocket} from '../interfaces'
import {IChatBot, IEmoji, IAmqSong} from '../../../shared/interfaces/database'
import {AuthError} from '../exceptions'
import {EmojiDatabase} from '../database/emoji'
import {ChatBotDatabase} from '../database/chat-bot'
import {AmqUserSongDatabase} from '../database/amq-user-song'
import {IBannerColor} from '../../../shared/types/game'
import {Server} from 'socket.io'

class AdminHandler extends AbstractHandler {
  protected _songDatabase: AmqSongDatabase
  protected _userSongDatabase: AmqUserSongDatabase
  protected _emojiDatabase: EmojiDatabase
  protected _chatBotDatabase: ChatBotDatabase
  protected _io: Server


  constructor(
    io: Server,
    logger: Logger,
    emitter: Emitter,
    songDatabase: AmqSongDatabase,
    userSongDatabase: AmqUserSongDatabase,
    emojiDatabase: EmojiDatabase,
    chatBotDatabase: ChatBotDatabase
  ) {
    super(logger, emitter)
    this._io = io
    this._userSongDatabase = userSongDatabase
    this._songDatabase = songDatabase
    this._emojiDatabase = emojiDatabase
    this._chatBotDatabase = chatBotDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('EDIT_AMQ_GAME_SONG', exceptionHandler(socket, (song: IAmqSong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'edit'}, song)
      )
      this._songDatabase.editSong(song)
      this._emitter.updateAmqSongList(this._songDatabase.getSongList())
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} edited`, socket.id)
    }))

    socket.on('ADD_AMQ_GAME_SONG', exceptionHandler(socket, (song: IAmqSong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'add'}, song)
      )
      this._songDatabase.addSong(song)
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} added`, socket.id)
    }))

    socket.on('DELETE_AMQ_GAME_SONG', exceptionHandler(socket, (song: IAmqSong): void => {
      this._checkAdminAuth(socket)
      this._logger.writeLog(
        LOG_BASE.LIST003,
        Object.assign({}, {id: socket.id, operation: 'delete'}, song)
      )
      this._songDatabase.deleteSong(song)
      this._emitter.updateAmqSongList(this._songDatabase.getSongList())
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

    socket.on('ADMIN_RELOAD_DATABASE', exceptionHandler(socket, (): void => {
      this._checkAdminAuth(socket)
      this._songDatabase.loadData()
      this._userSongDatabase.loadData()
      this._chatBotDatabase.loadData()
      this._emojiDatabase.loadData()
      this._emitter.updateAmqSongList(this._songDatabase.getSongList())
      this._emitter.updateAmqUsers(this._userSongDatabase.getUsers())
      this._emitter.updateAmqChoices(this._songDatabase.getChoices())
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList())
      this._emitter.updateChatBotList(this._chatBotDatabase.getChatBotList())
      this._emitter.systemNotification('success', 'Database reloaded', socket.id)
    }))

    socket.on('ADMIN_KICK_PLAYER', exceptionHandler(socket, (socketId: string): void => {
      this._checkAdminAuth(socket)
      this._emitter.systemNotification('error', 'You have been kicked', socketId)
      this._io.sockets.connected[socketId].disconnect()
    }))

    socket.on('ADMIN_SYSTEM_MESSAGE', exceptionHandler(socket, (message: string, color: IBannerColor): void => {
      this._checkAdminAuth(socket)
      this._emitter.systemNotification(color, message)
    }))
  }

  protected _checkAdminAuth(socket: ISocket): void {
    if (!socket.admin) {
      throw new AuthError('Invalid admin authentication')
    }
  }
}

export {AdminHandler}
