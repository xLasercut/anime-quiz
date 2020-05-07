import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {SongDatabase} from '../database/song'
import {UserSongDatabase} from '../database/user-song'
import {ISocket} from '../interfaces'
import {ISong} from '../../../shared/interfaces/database'

class ListPickerHandler extends AbstractHandler {
  protected _songDatabase: SongDatabase
  protected _userSongDatabase: UserSongDatabase
  protected _roomId = 'list-picker'

  constructor(logger: Logger, emitter: Emitter, songDatabase: SongDatabase, userSongDatabase: UserSongDatabase) {
    super(logger, emitter)
    this._songDatabase = songDatabase
    this._userSongDatabase = userSongDatabase
  }

  public start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('LOGIN_LIST_PICKER', exceptionHandler(socket, (): void => {
      socket.join(this._roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
    }))

    socket.on('GET_SONG_LIST', exceptionHandler(socket, (): void => {
      this._logger.writeLog(LOG_BASE.LIST001, {id: socket.id, data: 'song list'})
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
    }))

    socket.on('GET_USER_SONGS', exceptionHandler(socket, (user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST001, {id: socket.id, data: `${user} song data`})
      this._emitter.updateUserSongs(this._userSongDatabase.getUserSongs(user), socket.id)
    }))

    socket.on('ADD_USER_SONG', exceptionHandler(socket, (song: ISong, user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST002, {id: socket.id, operation: 'add', songId: song.songId, user: user})
      this._userSongDatabase.addSongId(song.songId, user)
      this._emitter.updateUserSongs(this._userSongDatabase.getUserSongs(user), this._roomId)
      this._emitter.systemNotification('success', `${song.anime[0]}: ${song.title} added`, socket.id)
    }))

    socket.on('DELETE_USER_SONG', exceptionHandler(socket, (song: ISong, user: string): void => {
      this._logger.writeLog(LOG_BASE.LIST002, {id: socket.id, operation: 'delete', songId: song.songId, user: user})
      this._userSongDatabase.deleteSongId(song.songId, user)
      this._emitter.updateUserSongs(this._userSongDatabase.getUserSongs(user), this._roomId)
      this._emitter.systemNotification('success', `${song.anime[0]}: ${song.title} deleted`, socket.id)
    }))
  }
}

export {ListPickerHandler}
