import { Server } from 'socket.io'
import { SHARED_EVENTS } from '../shared/events'
import { AqSongSerialised, AqUserSongsSerialised } from '../shared/interfaces'

class Emitter {
  protected _io: Server

  constructor(io: Server) {
    this._io = io
  }

  public systemNotification(color: string, message: string, sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.SYSTEM_NOTIFICATION, color, message)
  }

  public updateSongList(songList: AqSongSerialised[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_LIST, songList)
  }

  public updateAnimeList(animeList: string[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_ANIME_LIST, animeList)
  }

  public updateSongTitleList(songTitleList: string[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_SONG_TITLE_LIST, songTitleList)
  }

  public updateUserLists(userLists: AqUserSongsSerialised[], sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_USER_LISTS, userLists)
  }

  protected _client(sid: string) {
    if (sid) {
      return this._io.to(sid)
    }
    return this._io
  }
}

export {
  Emitter
}
