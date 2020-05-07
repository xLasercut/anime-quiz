import {IChoices, ISong} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {SONG_LIST_PATH} from '../config'
import {ServerDataError} from '../exceptions'
import {v4 as uuid} from 'uuid'

class SongDatabase {
  protected _songList: Array<ISong>
  protected _songIds: Set<string>
  protected _animeChoices: Array<string>
  protected _titleChoices: Array<string>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._songList = readFile(SONG_LIST_PATH).sort(this._sortByAnimeAndTitle)
    this._songIds = new Set()
    this._animeChoices = []
    this._titleChoices = []

    let animeDupes: Set<string> = new Set()
    let titleDupes: Set<string> = new Set()

    for (let song of this._songList) {
      this._songIds.add(song.songId)
      this._addTitleChoice(song, titleDupes)
      this._addAnimeChoice(song, animeDupes)
    }
  }

  public getSongList(): Array<ISong> {
    return this._songList
  }

  public getChoices(): IChoices {
    return {
      anime: this._animeChoices,
      title: this._titleChoices
    }
  }

  public validateSongIdExists(songId: string): void {
    if (!this._songIds.has(songId)) {
      throw new ServerDataError('Song ID not in database')
    }
  }

  public editSong(songToEdit: ISong): void {
    this.validateSongIdExists(songToEdit.songId)
    let index = this._songList.findIndex((song: ISong) => {
      return song.songId == songToEdit.songId
    })
    this._songList[index] = songToEdit
    writeFile(SONG_LIST_PATH, this._songList)
  }

  public addSong(song: ISong, songIdOverride: string = null): void {
    let songId = uuid()
    if (songIdOverride) {
      songId = songIdOverride
    }
    this.validateSongIdNotExists(songId)
    song.songId = songId
    this._songList.push(song)
    this._songIds.add(songId)
    writeFile(SONG_LIST_PATH, this._songList)
  }

  public deleteSong(songToDelete: ISong): void {
    this.validateSongIdExists(songToDelete.songId)
    let index = this._songList.findIndex((song: ISong) => {
      return song.songId == songToDelete.songId
    })
    this._songList.splice(index, 1)
    this._songIds.delete(songToDelete.songId)
    writeFile(SONG_LIST_PATH, this._songList)
  }

  public validateSongIdNotExists(songId: string): void {
    if (this._songIds.has(songId)) {
      throw new ServerDataError('Song ID already in database')
    }
  }

  protected _addAnimeChoice(song: ISong, animeDupes: Set<string>): void {
    for (let anime of song.anime) {
      let lowerCaseAnime = anime.toLowerCase()
      if (!animeDupes.has(lowerCaseAnime)) {
        this._animeChoices.push(anime)
        animeDupes.add(lowerCaseAnime)
      }
    }
  }

  protected _addTitleChoice(song: ISong, titleDupes: Set<string>): void {
    let lowerCaseTitle = song.title.toLowerCase()
    if (!titleDupes.has(lowerCaseTitle)) {
      this._titleChoices.push(song.title)
      titleDupes.add(lowerCaseTitle)
    }
  }

  protected _sortByAnimeAndTitle(a: ISong, b: ISong): number {
    let animeA = a.anime[0]
    let animeB = b.anime[0]
    let titleA = a.title
    let titleB = b.title

    if (animeA === animeB) {
      if (titleA > titleB) {
        return 1
      }
      else if (titleA < titleB) {
        return -1
      }
      return 0
    }
    else if (animeA > animeB) {
      return 1
    }
    return -1
  }

}

export {SongDatabase}
