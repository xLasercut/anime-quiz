import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {AmqSongDatabase} from '../database/amq-song'
import {AmqUserSongDatabase} from '../database/amq-user-song'
import {ISocket} from '../interfaces'
import {IAmqSong} from '../../../shared/interfaces/database'

class AmqSongListHandler extends AbstractHandler {
  protected _songDatabase: AmqSongDatabase
  protected _userSongDatabase: AmqUserSongDatabase
  protected _roomId = 'amq-song-list'

  constructor(logger: Logger, emitter: Emitter, songDatabase: AmqSongDatabase, userSongDatabase: AmqUserSongDatabase) {
    super(logger, emitter)
    this._songDatabase = songDatabase
    this._userSongDatabase = userSongDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('JOIN_AMQ_SONG', exceptionHandler(socket, (): void => {
      socket.join(this._roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      this._emitter.updateAmqSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateAmqUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateAmqChoices(this._songDatabase.getChoices(), socket.id)
    }))

    socket.on('GET_AMQ_SONG_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.LIST001, {id: socket.id, data: 'song list'})
      this._emitter.updateAmqSongList(this._songDatabase.getSongList(), socket.id)
    }))

    socket.on('GET_AMQ_USER_SONGS', exceptionHandler(socket, (user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST001, {id: socket.id, data: `${user} song data`})
      this._emitter.updateAmqUserSongs(this._userSongDatabase.getUserSongs(user), socket.id)
    }))

    socket.on('ADD_AMQ_USER_SONG', exceptionHandler(socket, (song: IAmqSong, user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST002, {id: socket.id, operation: 'add', songId: song.songId, user: user})
      this._userSongDatabase.addSongId(song.songId, user)
      this._emitter.updateAmqUserSongs(this._userSongDatabase.getUserSongs(user), this._roomId)
      this._emitter.systemNotification('success', `${song.anime[0]}: ${song.title} added`, socket.id)
    }))

    socket.on('DELETE_AMQ_USER_SONG', exceptionHandler(socket, (song: IAmqSong, user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST002, {id: socket.id, operation: 'delete', songId: song.songId, user: user})
      this._userSongDatabase.deleteSongId(song.songId, user)
      this._emitter.updateAmqUserSongs(this._userSongDatabase.getUserSongs(user), this._roomId)
      this._emitter.systemNotification('success', `${song.anime[0]}: ${song.title} deleted`, socket.id)
    }))
  }
}

export {AmqSongListHandler}
