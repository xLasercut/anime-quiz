import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {AwqGameController} from '../game/controllers/awq'
import {ChatManager} from '../game/chat'
import {EmojiDatabase} from '../database/emoji'
import {AwqWeaponDatabase} from '../database/awq-weapon'
import {AwqPlayer} from '../game/players/awq'
import {AmqPlayer} from '../game/players/amq'
import {IAmqSettings} from '../../../shared/interfaces/amq'
import {IAwqSettings} from '../../../shared/interfaces/awq'

class AwqHandler extends AbstractHandler {
  protected _weaponDatabase: AwqWeaponDatabase
  protected _chatManager: ChatManager
  protected _emojiDatabase: EmojiDatabase
  protected _controller: AwqGameController

  constructor(
    logger: Logger,
    emitter: Emitter,
    weaponDatabase: AwqWeaponDatabase,
    chatManager: ChatManager,
    emojiDatabase: EmojiDatabase,
    controller: AwqGameController
  ) {
    super(logger, emitter)
    this._weaponDatabase = weaponDatabase
    this._chatManager = chatManager
    this._emojiDatabase = emojiDatabase
    this._controller = controller
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('JOIN_AWQ_GAME_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._controller.newRoom(socket, roomName)
      socket.player = new AwqPlayer(username, avatar, socket.admin, socket.id)
      socket.player.host = true
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      this._emitter.updateAwqHost(true, socket.id)
      this._emitter.updateAwqRoomList(this._controller.getRoomList())
      this._emitter.updateAwqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), socket.id)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAwqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('JOIN_AWQ_GAME_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      this._controller.joinRoom(socket, roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      socket.player = new AmqPlayer(username, avatar, socket.admin, socket.id)
      this._emitter.updateAwqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAwqWeaponList(this._weaponDatabase.getWeaponList(), socket.id)
      this._emitter.updateAwqChoices(this._weaponDatabase.getChoices(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAwqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('LEAVE_ALL_ROOM', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('AWQ_GAME_CHAT', exceptionHandler(socket, (msg: string): void => {
      let roomId = this._controller.getRoomId(socket.id)
      let player = socket.player.serialize()
      this._emitter.updateGameChat(this._chatManager.generateUserMsg(
        socket.id,
        player.username,
        player.admin,
        player.avatar,
        msg
      ), roomId)
      let botMsg = this._chatManager.generateBotMsg(msg)
      if (botMsg) {
        this._emitter.updateGameChat(botMsg, roomId)
      }
    }))

    socket.on('GET_AWQ_GAME_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.GAME004, {id: socket.id})
      this._emitter.updateAwqRoomList(this._controller.getRoomList(), socket.id)
    }))

    socket.on('GET_AWQ_SETTINGS', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING003, {id: socket.id, username: socket.player.serialize().username})
      this._emitter.updateAwqSettings(this._controller.getRoom(roomId).settings.serialize(), socket.id)
    }))

    socket.on('UPDATE_AWQ_SETTINGS', exceptionHandler(socket, (awqSettings: IAwqSettings): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING004, Object.assign(
        {id: socket.id, username: socket.player.serialize().username},
        awqSettings
      ))
      this._controller.getRoom(roomId).settings.update(awqSettings)
      this._emitter.updateAwqSettings(this._controller.getRoom(roomId).settings.serialize(), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg('Game settings updated'), roomId)
    }))
  }

  protected _leaveRoom(socket: ISocket): void {
    let roomId = this._controller.leaveRoom(socket.id)
    if (roomId) {
      let player = socket.player.serialize()
      let socketId = this._controller.getNextHostId(roomId)
      this._controller.getSocket(socketId).player.host = true
      this._emitter.updateAwqHost(true, socketId)
      this._emitter.updateAwqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      socket.player = null
    }
  }
}

export {AwqHandler}
