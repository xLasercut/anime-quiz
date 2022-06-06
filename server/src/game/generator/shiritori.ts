import { AbstractGameListGenerator } from './abstract'
import { AqGameSettings, AqSong } from '../../shared/interfaces'
import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'
import { AqShiritoriModeNextSong } from '../../interfaces'

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
    while (songList.length < this._songCount && this._dupeSongIds.size < userSongs.length) {
      const { nextSong, animeName } = this._findNextSong(userSongs, lastLetter)
      if (nextSong) {
        songList.push(nextSong)
        this._addDupeSongId(nextSong)
        this._addDupeAnimeIds(nextSong)
        lastLetter = this._getLastLetter(animeName)
      } else {
        lastLetter = ''
      }
    }
    return songList
  }

  protected _findNextSong(userSongs: AqSong[], lastLetter: string): AqShiritoriModeNextSong {
    if (lastLetter) {
      return this._findNextSongFromLastLetter(userSongs, lastLetter)
    }
    return this._findNextSongStandard(userSongs)
  }

  protected _findNextSongFromLastLetter(userSongs: AqSong[], lastLetter: string): AqShiritoriModeNextSong {
    for (const song of userSongs) {
      for (const animeName of song.anime_name) {
        if (!this._isDupeSong(song) && this._getFirstLetter(animeName) === lastLetter && !this._isDupeAnime(song)) {
          return {
            nextSong: song,
            animeName: animeName
          }
        }
      }
    }
    return {
      nextSong: null,
      animeName: ''
    }
  }

  protected _findNextSongStandard(userSongs: AqSong[]): AqShiritoriModeNextSong {
    for (const song of userSongs) {
      if (!this._isDupeSong(song) && !this._isDupeAnime(song)) {
        return {
          nextSong: song,
          animeName: song.anime_name[0]
        }
      }
    }
    return {
      nextSong: null,
      animeName: ''
    }
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
