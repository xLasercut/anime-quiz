import { AbstractGameListGenerator } from './abstract'
import { AqGameSettings, AqSong } from '../../shared/interfaces'
import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'

class BalancedGameListGenerator extends AbstractGameListGenerator {
  protected _songsPerUser: number

  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb, settings: AqGameSettings) {
    super(songDb, userDb, settings)
  }

  public generate(): AqSong[] {
    if (this._users.length <= 0) {
      return []
    }
    this._songsPerUser = Math.floor(this._songCount / this._users.length)
    if (this._duplicate) {
      return this._generateDupeList()
    }
    return this._generateNonDupeList()
  }

  protected _generateDupeList(): AqSong[] {
    const userLists = this._userDb.getSelectedUserLists(this._users)
    const songList = []
    for (const userList of userLists) {
      let songCount = 0
      const userSongs = this._songDb.getSelectedUserSongs(userList.song_id)
      for (const song of userSongs) {
        if (!this._isDupeSong(song)) {
          songList.push(song)
          this._addDupeSongId(song)
          songCount += 1
        }

        if (songCount >= this._songsPerUser) {
          break
        }
      }
    }
    return songList
  }

  protected _generateNonDupeList(): AqSong[] {
    const userLists = this._userDb.getSelectedUserLists(this._users)
    const songList = []
    for (const userList of userLists) {
      let songCount = 0
      const userSongs = this._songDb.getSelectedUserSongs(userList.song_id)
      for (const song of userSongs) {
        if (!this._isDupeSong(song) && !this._isDupeAnime(song)) {
          songList.push(song)
          this._addDupeSongId(song)
          this._addDupeAnimeIds(song)
          songCount += 1
        }

        if (songCount >= this._songsPerUser) {
          break
        }
      }
    }
    return songList
  }
}

export {
  BalancedGameListGenerator
}
