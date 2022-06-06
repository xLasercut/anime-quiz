import { AbstractGameListGenerator } from './abstract'
import { AqGameSettings, AqSong } from '../../shared/interfaces'
import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'

class ShiritoriGameListGenerator extends AbstractGameListGenerator {
  protected _firstLetterPattern: RegExp

  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb, settings: AqGameSettings) {
    super(songDb, userDb, settings, false)
    this._firstLetterPattern = new RegExp('[A-Za-z]')
  }

  protected _generateList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    if (userSongs.length <= 0) {
      return []
    }
    const songList: AqSong[] = []
    let lastLetter = ''
    let unmatchCount = 0
    while (songList.length < this._songCount && unmatchCount < 2) {
      const nextSong = this._findNextSong(userSongs, lastLetter)
      if (nextSong) {
        songList.push(nextSong)
        this._addDupeSongId(nextSong)
        this._addDupeAnimeIds(nextSong)
        lastLetter = this._getLastLetter(nextSong.song_title)
        unmatchCount = 0
      } else {
        lastLetter = ''
        unmatchCount += 1
      }
    }
    return songList
  }

  protected _findNextSong(userSongs: AqSong[], lastLetter: string): AqSong {
    if (lastLetter) {
      return this._findNextSongFromLastLetter(userSongs, lastLetter)
    }
    return this._findNextSongStandard(userSongs)
  }

  protected _findNextSongFromLastLetter(userSongs: AqSong[], lastLetter: string): AqSong {
    for (const song of userSongs) {
      for (const animeName of song.anime_name) {
        if (!this._isDupeSong(song) && this._getFirstLetter(animeName) === lastLetter && !this._isDupeAnime(song)) {
          return song
        }
      }
    }
    return null
  }

  protected _findNextSongStandard(userSongs: AqSong[]): AqSong {
    for (const song of userSongs) {
      if (!this._isDupeSong(song) && !this._isDupeAnime(song)) {
        return song
      }
    }
    return null
  }

  protected _getLastLetter(name: string): string {
    const nameReversed = name.split('').reverse().join('')
    if (this._firstLetterPattern.test(nameReversed)) {
      return nameReversed.match(this._firstLetterPattern)[0].toLowerCase()
    }

    return ''
  }

  protected _getFirstLetter(name: string): string {
    if (this._firstLetterPattern.test(name)) {
      return name.match(this._firstLetterPattern)[0].toLowerCase()
    }

    return ''
  }
}

export {
  ShiritoriGameListGenerator
}
