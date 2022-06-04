import { AbstractGameListGenerator } from './abstract'
import { AqGameSettings, AqSong } from '../../shared/interfaces'
import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'

class BalancedPlusGameListGenerator extends AbstractGameListGenerator {
  protected _songsPerUser: number
  protected _normalSongCount: number

  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb, settings: AqGameSettings) {
    super(songDb, userDb, settings)
  }

  public generate(): AqSong[] {
    if (this._users.length <= 0) {
      return []
    }
    this._normalSongCount = Math.floor(this._songCount / 2)
    this._songsPerUser = Math.floor(this._normalSongCount / this._users.length)
    if (this._duplicate) {
      return this._generateDupeList()
    }
    return this._generateNonDupeList()
  }

  protected _generateNonDupeNormalList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    const songList = []
    for (const song of userSongs) {
      if (!this._isDupeAnime(song) && !this._isDupeSong(song)) {
        songList.push(song)
        this._addDupeAnimeIds(song)
        this._addDupeSongId(song)
        if (songList.length >= this._normalSongCount) {
          break
        }
      }
    }
    return songList
  }

  protected _generateNonDupeBalancedList(): AqSong[] {
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

  protected _generateDupeNormalList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    const songList = userSongs.slice(0, this._normalSongCount)
    for (const song of songList) {
      this._addDupeSongId(song)
    }
    return songList
  }

  protected _generateDupeBalancedList(): AqSong[] {
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

  protected _generateDupeList(): AqSong[] {
    return this._generateDupeNormalList()
      .concat(this._generateDupeBalancedList())
  }

  protected _generateNonDupeList(): AqSong[] {
    return this._generateNonDupeNormalList()
      .concat(this._generateNonDupeBalancedList())
  }
}

export {
  BalancedPlusGameListGenerator
}
