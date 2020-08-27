import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {ISocket} from '../interfaces'
import {AmqPlayer} from '../game/players/amq'
import {Server} from 'socket.io'
import {AmqSongDatabase} from '../database/amq-song'
import {AmqUserSongDatabase} from '../database/amq-user-song'
import {ChatManager} from '../game/chat'
import {EmojiDatabase} from '../database/emoji'
import {IAmqGuess, IAmqSettings} from '../../../shared/interfaces/amq'
import {IAmqSong} from '../../../shared/interfaces/database'
import {AmqGameController} from '../game/controllers/amq'

class AmqHandler extends AbstractHandler {
  protected _songDatabase: AmqSongDatabase
  protected _userSongDatabase: AmqUserSongDatabase
  protected _chatManager: ChatManager
  protected _emojiDatabase: EmojiDatabase
  protected _controller: AmqGameController

  constructor(
    logger: Logger,
    emitter: Emitter,
    controller: AmqGameController,
    chatManager: ChatManager,
    songDatabase: AmqSongDatabase,
    userSongDatabase: AmqUserSongDatabase,
    emojiDatabase: EmojiDatabase
  ) {
    super(logger, emitter)
    this._controller = controller
    this._songDatabase = songDatabase
    this._userSongDatabase = userSongDatabase
    this._chatManager = chatManager
    this._emojiDatabase = emojiDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('JOIN_AMQ_GAME_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._controller.newRoom(socket, roomName)
      socket.player = new AmqPlayer(username, avatar, socket.admin, socket.id)
      socket.player.host = true
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      this._emitter.updateAmqHost(true, socket.id)
      this._emitter.updateAmqRoomList(this._controller.getRoomList())
      this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAmqSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateAmqChoices(this._songDatabase.getChoices(), socket.id)
      this._emitter.updateAmqUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAmqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('JOIN_AMQ_GAME_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      this._controller.joinRoom(socket, roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: roomId})
      socket.player = new AmqPlayer(username, avatar, socket.admin, socket.id)
      this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateAmqSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateAmqChoices(this._songDatabase.getChoices(), socket.id)
      this._emitter.updateAmqUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAmqGameState(this._controller.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('AMQ_GUESS', exceptionHandler(socket, (amqGuess: IAmqGuess): void => {
      let roomId = this._controller.getRoomId(socket.id)
      socket.player.guess = amqGuess
      let {point, color} = this._controller.getRoom(roomId).state.calculateScore(amqGuess)
      socket.player.score += point
      socket.player.color = color
      socket.player.ready.guess = true
    }))

    socket.on('AMQ_SONG_LOADED', exceptionHandler(socket, (): void => {
      socket.player.ready.load = true
    }))

    socket.on('LEAVE_ALL_ROOM', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('GET_AMQ_SETTINGS', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING001, {id: socket.id, username: socket.player.serialize().username})
      this._emitter.updateAmqSettings(this._controller.getRoom(roomId).settings.serialize(), socket.id)
    }))

    socket.on('UPDATE_AMQ_SETTINGS', exceptionHandler(socket, (amqSettings: IAmqSettings): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._logger.writeLog(LOG_BASE.SETTING002, Object.assign(
        {id: socket.id, username: socket.player.serialize().username},
        amqSettings
      ))
      this._controller.getRoom(roomId).settings.update(amqSettings)
      this._emitter.updateAmqSettings(this._controller.getRoom(roomId).settings.serialize(), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg('Game settings updated'), roomId)

    }))

    socket.on('START_AMQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._controller.resetPlayerScore(roomId)
      this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
      if (this._controller.getRoom(roomId).settings.gameMode === 'balanced') {
        this._generateBalancedGameList(roomId)
      }
      else {
        this._generateGameList(roomId)
      }
    }))

    socket.on('STOP_AMQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._resetAmq(roomId)
    }))

    socket.on('AMQ_SONG_OVERRIDE', exceptionHandler(socket, (song: IAmqSong): void => {
      let roomId = this._controller.getRoomId(socket.id)
      this._controller.getRoom(roomId).state.songOverride = song
      this._logger.writeLog(
        LOG_BASE.GAME003,
        Object.assign({roomId: roomId}, song)
      )
      this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} selected`, socket.id)
    }))

    socket.on('GET_AMQ_GAME_ROOM_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.GAME004, {id: socket.id})
      this._emitter.updateAmqRoomList(this._controller.getRoomList(), socket.id)
    }))

    socket.on('AMQ_GAME_CHAT', exceptionHandler(socket, (msg: string): void => {
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
  }

  protected _generateBalancedGameList(roomId: string): void {
    let gameSettings = this._controller.getRoom(roomId).settings.serialize()
    let playedSongIds = this._controller.getRoom(roomId).state.playedSongIds
    let gameSongLists = this._userSongDatabase.generateBalancedSongLists(gameSettings.users, playedSongIds)
    this._controller.getRoom(roomId).state.prepareBalancedGameList(gameSongLists, gameSettings)
    this._checkGameList(roomId)
  }

  protected _generateGameList(roomId: string): void {
    let gameSettings = this._controller.getRoom(roomId).settings.serialize()
    let playedSongIds = this._controller.getRoom(roomId).state.playedSongIds
    let gameSongLists = this._userSongDatabase.generateCombinedSongLists(gameSettings.users, playedSongIds)
    this._controller.getRoom(roomId).state.prepareGameList(gameSongLists, gameSettings)
    this._checkGameList(roomId)
  }

  protected _checkGameList(roomId: string): void {
    if (this._controller.getRoom(roomId).state.gameList.length > 0) {
      this._controller.getRoom(roomId).state.startGame()
      this._logger.writeLog(LOG_BASE.GAME001, {
        roomId: roomId,
        gameMode: this._controller.getRoom(roomId).settings.gameMode,
        songCount: this._controller.getRoom(roomId).state.maxSongCount
      })
      this._emitter.updateAmqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
      this._newRound(roomId)
        .catch((e) => {
          console.log(e)
        })
    }
    else {
      this._emitter.updateGameChat(this._chatManager.generateSysMsg('Empty song list'), roomId)
    }
  }

  protected async _newRound(roomId: string): Promise<any> {
    this._controller.newRound(roomId)
    this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
    await this._amqFlowMain(roomId)

  }

  protected async _amqFlowMain(roomId: string): Promise<any> {
    let settings = this._controller.getRoom(roomId).settings
    this._controller.getRoom(roomId).state.newSong(settings.leastPlayed)
    this._emitter.amqNewSong(roomId)
    this._emitter.updateAmqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
    this._logger.writeLog(
      LOG_BASE.GAME002,
      Object.assign({roomId: roomId}, this._controller.getRoom(roomId).state.currentSong)
    )
    this._emitter.amqStartLoad(roomId)
    await this._controller.startCountdown(roomId, 5000, 'load')
    this._emitter.amqStartCountdown(roomId)
    await this._controller.startTimeout(roomId, settings.guessTime * 1000)
    this._emitter.amqTimeUp(roomId)
    await this._controller.startCountdown(roomId, 5000, 'guess')
    this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
    this._emitter.amqShowGuess(roomId)
    if (this._controller.getRoom(roomId).state.currentSongCount >= this._controller.getRoom(roomId).state.maxSongCount) {
      this._resetAmq(roomId)
    }
    else {
      await this._controller.startTimeout(roomId, 10000)
      await this._newRound(roomId)
    }

  }

  protected _leaveRoom(socket: ISocket): void {
    let roomId = this._controller.leaveRoom(socket.id)
    if (roomId) {
      let player = socket.player.serialize()
      let socketId = this._controller.getNextHostId(roomId)
      this._controller.getSocket(socketId).player.host = true
      this._emitter.updateAmqHost(true, socketId)
      this._emitter.updateAmqPlayerList(this._controller.getPlayerList(roomId), roomId)
      this._emitter.updateGameChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      socket.player = null
    }
  }

  protected _resetAmq(roomId: string): void {
    this._controller.getRoom(roomId).state.reset()
    this._controller.resetTimer(roomId)
    this._emitter.updateAmqGameState(this._controller.getRoom(roomId).state.serialize(), roomId)
    this._emitter.amqReset(roomId)
  }
}

export {AmqHandler}
