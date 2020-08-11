import * as socketio from 'socket.io'
import {IBannerColor} from '../../../shared/types/game'
import {IChatBot, IAmqChoices, IEmoji, IAmqSong} from '../../../shared/interfaces/database'
import {IAmqGameState, IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'
import {IChat, IRoomSerial} from '../../../shared/interfaces/game'

class Emitter {
  protected _io: socketio.Server

  constructor(io: socketio.Server) {
    this._io = io
  }

  public updateAmqSongList(songList: Array<IAmqSong>, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_SONG_LIST', songList)
  }

  public updateEmojiList(emojiList: Array<IEmoji>, sid: string = null): void {
    this._client(sid).emit('UPDATE_EMOJI_LIST', emojiList)
  }

  public updateChatBotList(chatBotList: Array<IChatBot>, sid: string = null): void {
    this._client(sid).emit('UPDATE_CHAT_BOT_LIST', chatBotList)
  }

  public updateAmqUsers(users: Array<string>, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_USERS', users)
  }

  public updateAmqUserSongs(userSongs: Array<string>, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_USER_SONGS', userSongs)
  }

  public updateAmqChoices(choices: IAmqChoices, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_CHOICES', choices)
  }

  public updateAdmin(admin: boolean, sid: string): void {
    this._client(sid).emit('UPDATE_ADMIN', admin)
  }

  public updateRoomList(roomList: Array<IRoomSerial>, sid: string = null): void {
    this._client(sid).emit('UPDATE_ROOM_LIST', roomList)
  }

  public updateAmqPlayerList(amqPlayerList: Array<IAmqPlayer>, sid: string): void {
    this._client(sid).emit('UPDATE_AMQ_PLAYER_LIST', amqPlayerList)
  }

  public updateAmqGameState(amqGameState: IAmqGameState, sid: string): void {
    this._client(sid).emit('UPDATE_AMQ_GAME_STATE', amqGameState)
  }

  public updateAmqHost(host: boolean, sid: string): void {
    this._client(sid).emit('UPDATE_AMQ_HOST', host)
  }

  public amqNewSong(sid: string): void {
    this._client(sid).emit('AMQ_NEW_SONG')
  }

  public amqStartLoad(sid: string): void {
    this._client(sid).emit('AMQ_START_LOAD')
  }

  public amqStartCountdown(sid: string): void {
    this._client(sid).emit('AMQ_START_COUNTDOWN')
  }

  public amqTimeUp(sid: string): void {
    this._client(sid).emit('AMQ_TIME_UP')
  }

  public amqShowGuess(sid: string): void {
    this._client(sid).emit('AMQ_SHOW_GUESS')
  }

  public amqReset(sid: string): void {
    this._client(sid).emit('AMQ_RESET')
  }

  public systemNotification(color: IBannerColor, message: string, sid: string = null): void {
    this._client(sid).emit('SYSTEM_NOTIFICATION', color, message)
  }

  public sendChat(chat: IChat, sid: string = null): void {
    this._client(sid).emit('UPDATE_CHAT_MESSAGE', chat)
  }

  public updateAmqSettings(amqSettings: IAmqSettings, sid: string = null): void {
    this._client(sid).emit('UPDATE_AMQ_SETTINGS', amqSettings)
  }

  protected _client(sid: string = null): socketio.Namespace | socketio.Server {
    if (sid) {
      return this._io.to(sid)
    }
    return this._io
  }
}

export {Emitter}
