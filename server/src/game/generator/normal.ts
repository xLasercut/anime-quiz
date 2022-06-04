import { AbstractGameListGenerator } from './abstract'
import { AqSong } from '../../shared/interfaces'

class NormalGameListGenerator extends AbstractGameListGenerator {
  public generate(): AqSong[] {
    if (this._users.length <= 0) {
      return []
    }
    if (this._duplicate) {
      return this._generateDupeList()
    }
    return this._generateNonDupeList()
  }

  protected _generateDupeList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    return userSongs.slice(0, this._songCount)
  }

  protected _generateNonDupeList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    const songList = []
    for (const song of userSongs) {
      if (!this._isDupeAnime(song)) {
        songList.push(song)
        this._addDupeAnimeIds(song)
        if (songList.length >= this._songCount) {
          break
        }
      }
    }
    return songList
  }
}

export {
  NormalGameListGenerator
}
