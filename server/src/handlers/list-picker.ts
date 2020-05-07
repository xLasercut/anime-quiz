import {AbstractHandler} from './abstract'
import {LOG_BASE, Logger} from '../app/logging'
import {Emitter} from '../app/emitter'
import {SongDatabase} from '../database/song'
import {UserSongDatabase} from '../database/user-song'
import {ISocket} from '../interfaces'

class ListPickerHandler extends AbstractHandler {
  protected _songDatabase: SongDatabase
  protected _userSongDatabase: UserSongDatabase
  protected _roomId = 'list-picker'

  constructor(logger: Logger, emitter: Emitter, songDatabase: SongDatabase, userSongDatabase: UserSongDatabase) {
    super(logger, emitter)
    this._songDatabase = songDatabase
    this._userSongDatabase = userSongDatabase
  }

  start(socket: ISocket, exceptionHandler: Function): void {
    socket.on('LOGIN_LIST_PICKER', exceptionHandler(socket, (): void => {
      socket.join(this._roomId)
      this._logger.writeLog(LOG_BASE.SERVER005, {id: socket.id, roomId: this._roomId})
      this._emitter.updateSongList(this._songDatabase.getSongList(), socket.id)
      this._emitter.updateUsers(this._userSongDatabase.getUsers(), socket.id)
      this._emitter.updateChoices(this._songDatabase.getChoices(), socket.id)
    }))

    socket.on('GET_USER_SONGS', exceptionHandler(socket, (user: string): void => {
      this._emitter.updateUserSongs(this._userSongDatabase.getUserSongs(user), socket.id)
    }))
  }
}

export {ListPickerHandler}
