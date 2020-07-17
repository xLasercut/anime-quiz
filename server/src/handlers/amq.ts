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
import {IAmqGuess, IAmqSettings} from '../../../shared/interfaces/amq'
import {AmqTimer} from '../game/timers/amq'
import {ISong} from '../../../shared/interfaces/database'

class AmqHandler extends AbstractHandler {
  protected _roomManager: AmqRoomManager
  protected _songDatabase: SongDatabase
  protected _userSongDatabase: UserSongDatabase
  protected _chatManager: ChatManager
  protected _emojiDatabase: EmojiDatabase
  protected _timer: AmqTimer
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
    this._timer = new AmqTimer(roomManager)
  }

  public start(socket: ISocket, exceptionHandler: Function) {
    socket.on('LOGIN_AMQ_NEW', exceptionHandler(socket, (roomName: string, username: string, avatar: string): void => {
      this._roomManager.newRoom(socket, roomName)
      socket.player = new AmqPlayer(username, avatar, socket.admin)
      socket.player.host = true
      let roomId = socket.roomId
      this._emitter.updateAmqHost(true, socket.id)
      this._emitter.updateRoomList(this._roomManager.getRoomList())
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
      this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
      this._emitter.updateAmqGameState(this._roomManager.getRoom(roomId).state.serialize(), socket.id)
      this._emitter.sendChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
    }))

    socket.on('LOGIN_AMQ_EXIST', exceptionHandler(socket, (roomId: string, username: string, avatar: string): void => {
      if (this._roomManager.isAmqRoom(roomId)) {
        socket.player = new AmqPlayer(username, avatar, socket.admin)
        socket.roomId = roomId
        socket.join(roomId)
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
        this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
        this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
        this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
        this._emitter.updateEmojiList(this._emojiDatabase.getEmojiList(), socket.id)
        this._emitter.updateAmqGameState(this._roomManager.getRoom(roomId).state.serialize(), socket.id)
        this._emitter.sendChat(this._chatManager.generateSysMsg(`${username} has joined the room`), roomId)
      }
    }))

    socket.on('AMQ_GUESS', exceptionHandler(socket, (amqGuess: IAmqGuess): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        socket.player.guess = amqGuess
        let {point, color} = this._roomManager.getRoom(roomId).state.calculateScore(amqGuess)
        socket.player.score += point
        socket.player.color = color
        socket.player.ready.guess = true
      }
    }))

    socket.on('AMQ_SONG_LOADED', exceptionHandler(socket, (): void => {
      socket.player.ready.load = true
    }))

    socket.on('LEAVE_ROOM', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('disconnect', exceptionHandler(socket, (): void => {
      this._leaveRoom(socket)
    }))

    socket.on('GET_AMQ_SETTINGS', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._logger.writeLog(LOG_BASE.SETTING001, {id: socket.id, username: socket.player.serialize().username})
        this._emitter.updateAmqSettings(this._roomManager.getRoom(socket.roomId).settings.serialize(), socket.id)
      }
    }))

    socket.on('UPDATE_AMQ_SETTINGS', exceptionHandler(socket, (amqSettings: IAmqSettings): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._logger.writeLog(LOG_BASE.SETTING002, Object.assign(
          {id: socket.id, username: socket.player.serialize().username},
          amqSettings
        ))
        this._roomManager.getRoom(roomId).settings.update(amqSettings)
        this._emitter.updateAmqSettings(this._roomManager.getRoom(roomId).settings.serialize(), roomId)
        this._emitter.sendChat(this._chatManager.generateSysMsg('Game settings updated'), roomId)
      }
    }))

    socket.on('START_AMQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._roomManager.resetPlayerScore(roomId)
        this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
        if (this._roomManager.getRoom(roomId).settings.gameMode === 'balanced') {
          this._generateBalancedGameList(roomId)
        }
        else {
          this._generateGameList(roomId)
        }
      }
    }))

    socket.on('STOP_AMQ_GAME', exceptionHandler(socket, (): void => {
      let roomId = socket.roomId
      this._resetAmq(roomId)
    }))

    socket.on('AMQ_SONG_OVERRIDE', exceptionHandler(socket, (song: ISong): void => {
      let roomId = socket.roomId
      if (this._roomManager.isAmqRoom(roomId)) {
        this._roomManager.getRoom(roomId).state.songOverride = song
        this._logger.writeLog(
          LOG_BASE.GAME003,
          Object.assign({roomId: roomId}, song)
        )
        this._emitter.systemNotification('success', `${song.anime[0]} - ${song.title} selected`, socket.id)
      }
    }))
  }

  protected _generateBalancedGameList(roomId: string): void {
    if (this._roomManager.isAmqRoom(roomId)) {
      let gameSettings = this._roomManager.getRoom(roomId).settings.serialize()
      let playedSongIds = this._roomManager.getRoom(roomId).state.playedSongIds
      let gameSongLists = this._userSongDatabase.generateBalancedSongLists(gameSettings.users, playedSongIds)
      this._roomManager.getRoom(roomId).state.prepareBalancedGameList(gameSongLists, gameSettings)
      this._checkGameList(roomId)
    }
  }

  protected _generateGameList(roomId: string): void {
    if (this._roomManager.isAmqRoom(roomId)) {
      let gameSettings = this._roomManager.getRoom(roomId).settings.serialize()
      let playedSongIds = this._roomManager.getRoom(roomId).state.playedSongIds
      let gameSongLists = this._userSongDatabase.generateCombinedSongLists(gameSettings.users, playedSongIds)
      this._roomManager.getRoom(roomId).state.prepareGameList(gameSongLists, gameSettings)
      this._checkGameList(roomId)
    }
  }

  protected _checkGameList(roomId: string): void {
    if (this._roomManager.isAmqRoom(roomId)) {
      if (this._roomManager.getRoom(roomId).state.gameList.length > 0) {
        this._roomManager.getRoom(roomId).state.startGame()
        this._logger.writeLog(LOG_BASE.GAME001, {
          roomId: roomId,
          gameMode: this._roomManager.getRoom(roomId).settings.gameMode,
          songCount: this._roomManager.getRoom(roomId).state.maxSongCount
        })
        this._emitter.updateAmqGameState(this._roomManager.getRoom(roomId).state.serialize(), roomId)
        this._newRound(roomId)
          .catch((e) => {
            console.log(e)
          })
      }
      else {
        this._emitter.sendChat(this._chatManager.generateSysMsg('Empty song list'), roomId)
      }
    }
  }

  protected async _newRound(roomId: string): Promise<any> {
    if (this._roomManager.isAmqRoom(roomId)) {
      this._roomManager.newRound(roomId)
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      if (this._roomManager.getRoom(roomId).settings.gameMode === 'selector') {
        await this._amqFlowSelector(roomId)
      }
      else {
        await this._amqFlowMain(roomId)
      }
    }
  }

  protected async _amqFlowSelector(roomId: string): Promise<any> {
    if (this._roomManager.isAmqRoom(roomId)) {
      await this._amqFlowMain(roomId)
    }
  }

  protected async _amqFlowMain(roomId: string): Promise<any> {
    if (this._roomManager.isAmqRoom(roomId)) {
      let settings = this._roomManager.getRoom(roomId).settings
      this._roomManager.getRoom(roomId).state.newSong(settings.leastPlayed)
      this._emitter.updateAmqGameState(this._roomManager.getRoom(roomId).state.serialize(), roomId)
      this._logger.writeLog(
        LOG_BASE.GAME002,
        Object.assign({roomId: roomId}, this._roomManager.getRoom(roomId).state.currentSong)
      )
      this._emitter.amqNewSong(roomId)
      this._emitter.amqStartLoad(roomId)
      await this._timer.startCountdown(roomId, 5000, 'load')
      this._emitter.amqStartCountdown(roomId)
      await this._timer.startTimeout(roomId, settings.guessTime * 1000)
      this._emitter.amqTimeUp(roomId)
      await this._timer.startCountdown(roomId, 5000, 'guess')
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      this._emitter.amqShowGuess(roomId)
      if (this._roomManager.getRoom(roomId).state.currentSongCount >= this._roomManager.getRoom(roomId).state.maxSongCount) {
        this._resetAmq(roomId)
      }
      else {
        await this._timer.startTimeout(roomId, 10000)
        await this._newRound(roomId)
      }
    }
  }

  protected _leaveRoom(socket: ISocket): void {
    let roomId = socket.roomId
    if (this._roomManager.isAmqRoom(roomId)) {
      let player = socket.player.serialize()
      let socketId = this._roomManager.getNextHostId(roomId)
      this._roomManager.getPlayer(socketId).host = true
      this._emitter.updateAmqHost(true, socketId)
      this._emitter.updateAmqPlayerList(this._roomManager.getPlayerList(roomId), roomId)
      this._emitter.sendChat(this._chatManager.generateSysMsg(`${player.username} has left the room`), roomId)
      socket.roomId = ''
    }
  }

  protected _resetAmq(roomId: string): void {
    if (this._roomManager.isAmqRoom(roomId)) {
      this._timer.resetTimeout(roomId)
      this._timer.resetCountdown(roomId)
      this._roomManager.getRoom(roomId).state.reset()
      this._emitter.updateAmqGameState(this._roomManager.getRoom(roomId).state.serialize(), roomId)
      this._emitter.amqReset(roomId)
    }
  }
}

export {AmqHandler}
