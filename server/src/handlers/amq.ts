import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {IRoomType} from '../../../shared/types/game'
import {AmqPlayer} from '../game/players/amq'
import {Server} from 'socket.io'
import {AmqRoomManager} from '../game/rooms/amq'
import {SongDatabase} from '../database/song'
import {UserSongDatabase} from '../database/user-song'
import {ChatManager} from '../game/chat'
import {EmojiDatabase} from '../database/emoji'
import {IAmqSettings} from '../../../shared/interfaces/amq'

class AmqHandler extends AbstractHandler {
  protected _roomManager: AmqRoomManager
  protected _songDatabase: SongDatabase
  protected _userSongDatabase: UserSongDatabase
  protected _chatManager: ChatManager
  protected _emojiDatabase: EmojiDatabase
  protected _roomType: IRoomType = 'amq'

  constructor(
    io: Server,
    logger: Logger,
    emitter: Emitter,
    roomManager: AmqRoomManager,
    chatManager: ChatManager,
    songDatabase: SongDatabase,
    userSongDatabase: UserSongDatabase,
    emojiDatabase: EmojiDatabase
  ) {
    super(logger, emitter)
    this._roomManager = roomManager
    this._songDatabase = songDatabase
    this._userSongDatabase = userSongDatabase
    this._chatManager = chatManager
    this._emojiDatabase = emojiDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LOGIN_AMQ_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._roomManager.newRoom(socket, roomName)
      socket.player = new AmqPlayer(username, avatar, socket.admin)
      socket.player.host = true
      let roomId = socket.roomId
      this._emitter.updateRoomList(this._roomManager.getRoomList())
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
      this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.sendChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('LOGIN_AMQ_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      socket.player = new AmqPlayer(username, avatar, socket.admin)
      socket.roomId = roomId
      socket.join(roomId)
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
      this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.sendChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        let player = socket.player.serialize()
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
        this._emitter.sendChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      }
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        let player = socket.player.serialize()
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
        this._emitter.sendChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      }
    }))

    socket.on('GET_AMQ_SETTINGS', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.SETTING001, {id: socket.id, username: socket.player.serialize().username})
      this._emitter.updateAmqSettings(this._roomManager.getRoom(socket.roomId).settings.serialize(), socket.id)
    }))

    socket.on('UPDATE_AMQ_SETTINGS', exceptionHandler(socket, (amqSettings: IAmqSettings): void => {
      let roomId = socket.roomId
      this._logger.writeLog(LOG_BASE.SETTING002, Object.assign(
        {id: socket.id, username: socket.player.serialize().username},
        amqSettings
      ))
      this._roomManager.getRoom(roomId).settings.update(amqSettings)
      this._emitter.updateAmqSettings(this._roomManager.getRoom(roomId).settings.serialize(), roomId)
      this._emitter.sendChat(this._chatManager.generateSysMsg('Game settings updated'), roomId)
    }))
  }
}

export {AmqHandler}
