import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {AiqGameController} from '../game/controllers/aiq'
import {ChatManager} from '../game/chat'
import {EmojiDatabase} from '../database/emoji'
import {AiqImageDatabase} from '../database/aiq-image'
import {AiqPlayer} from '../game/players/aiq'
import {IAiqGuess, IAiqSettings} from '../../../shared/interfaces/aiq'


class AiqHandler extends AbstractHandler {
  protected _imageDatabase: AiqImageDatabase
  protected _chatManager: ChatManager
  protected _emojiDatabase: EmojiDatabase
  protected _controller: AiqGameController

  constructor(
    logger: Logger,
    emitter: Emitter,
    imageDatabase: AiqImageDatabase,
    chatManager: ChatManager,
    emojiDatabase: EmojiDatabase,
    controller: AiqGameController
  ) {
    super(logger, emitter)
    this._imageDatabase = imageDatabase
    this._chatManager = chatManager
    this._emojiDatabase = emojiDatabase
    this._controller = controller
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('JOIN_AIQ_GAME_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._controller.newRoom(socket, roomName)
      socket.player = new AiqPlayer(username, avatar, socket.admin, socket.id)
      socket.player.host = true
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      this._emitter.updateAiqHost(true, socket.id)
      this._emitter.updateAiqRoomList(this._controller.getRoomList())
      this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), socket.id)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAiqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('JOIN_AIQ_GAME_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      this._controller.joinRoom(socket, roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      socket.player = new AiqPlayer(username, avatar, socket.admin, socket.id)
      this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAiqImageList(this._imageDatabase.getImageList(), socket.id)
      this._emitter.updateAiqChoices(this._imageDatabase.getChoices(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAiqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('LEAVE_ALL_ROOM', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('AIQ_GAME_CHAT', exceptionHandler(socket, (msg: string): void => {
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

    socket.on('GET_AIQ_GAME_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.GAME005, {id: socket.id})
      this._emitter.updateAiqRoomList(this._controller.getRoomList(), socket.id)
    }))

    socket.on('GET_AIQ_SETTINGS', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING003, {id: socket.id, username: socket.player.serialize().username})
      this._emitter.updateAiqSettings(this._controller.getRoom(roomId).settings.serialize(), socket.id)
    }))

    socket.on('UPDATE_AIQ_SETTINGS', exceptionHandler(socket, (aiqSettings: IAiqSettings): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING004, Object.assign(
        {id: socket.id, username: socket.player.serialize().username},
        aiqSettings
      ))
      this._controller.getRoom(roomId).settings.update(aiqSettings)
      this._emitter.updateAiqSettings(this._controller.getRoom(roomId).settings.serialize(), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg('Game settings updated'), roomId)
    }))

    socket.on('START_AIQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._controller.resetPlayerScore(roomId)
      this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._generateGameList(roomId)
    }))

    socket.on('STOP_AIQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._resetAiq(roomId)
    }))

    socket.on('AIQ_SONG_LOADED', exceptionHandler(socket, (): void => {
      socket.player.ready.load = true
    }))

    socket.on('AIQ_GUESS', exceptionHandler(socket, (guess: IAiqGuess): void => {
      let roomId = this._controller.getRoomId(socket.id)
      socket.player.guess = guess
      let {point, color} = this._controller.getRoom(roomId).state.calculateScore(guess)
      socket.player.score += point
      socket.player.color = color
      socket.player.ready.guess = true
    }))
  }

  protected _leaveRoom(socket: ISocket): void {
    let roomId = this._controller.leaveRoom(socket.id)
    if (roomId) {
      let player = socket.player.serialize()
      let socketId = this._controller.getNextHostId(roomId)
      this._controller.getSocket(socketId).player.host = true
      this._emitter.updateAiqHost(true, socketId)
      this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      socket.player = null
    }
  }

  protected _generateGameList(roomId: string): void {
    let gameSettings = this._controller.getRoom(roomId).settings.serialize()
    let gameImageList = this._imageDatabase.getImageList()
    this._controller.getRoom(roomId).state.prepareGameList(gameImageList, gameSettings)
    this._checkGameList(roomId)
  }

  protected _checkGameList(roomId: string): void {
    if (this._controller.getRoom(roomId).state.gameList.length > 0) {
      this._controller.getRoom(roomId).state.startGame()
      this._logger.writeLog(LOG_BASE.GAME006, {
        roomId: roomId,
        imageCount: this._controller.getRoom(roomId).state.maxImageCount
      })
      this._emitter.updateAiqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
      this._newRound(roomId)
        .catch((e) => {
          console.log(e)
        })
    }
    else {
      this._emitter.updateGameChat(this._chatManager.generateSysMsg('Empty image list'), roomId)
    }
  }

  protected async _newRound(roomId: string): Promise<any> {
    this._controller.newRound(roomId)
    this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
    await this._aiqFlowMain(roomId)
  }

  protected async _aiqFlowMain(roomId: string): Promise<any> {
    let settings = this._controller.getRoom(roomId).settings
    this._controller.getRoom(roomId).state.newImage()
    this._emitter.aiqNewImage(roomId)
    this._emitter.updateAiqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
    this._logger.writeLog(
      LOG_BASE.GAME007,
      Object.assign({roomId: roomId}, this._controller.getRoom(roomId).state.currentImage)
    )
    this._emitter.aiqStartLoad(roomId)
    await this._controller.startCountdown(roomId, 5000, 'load')
    this._emitter.aiqStartCountdown(roomId)
    await this._controller.startTimeout(roomId, settings.guessTime * 1000)
    this._emitter.aiqTimeUp(roomId)
    await this._controller.startCountdown(roomId, 5000, 'guess')
    this._emitter.updateAiqPlayerList(this._controller.getPlayerList(roomId), roomId)
    this._emitter.aiqShowGuess(roomId)
    if (this._controller.getRoom(roomId).state.currentImageCount >= this._controller.getRoom(roomId).state.maxImageCount) {
      this._resetAiq(roomId)
    }
    else {
      await this._controller.startTimeout(roomId, 10000)
      await this._newRound(roomId)
    }

  }

  protected _resetAiq(roomId: string): void {
    this._controller.getRoom(roomId).state.reset()
    this._controller.resetTimer(roomId)
    this._emitter.updateAiqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
    this._emitter.aiqReset(roomId)
  }
}

export {AiqHandler}
