import {IAmqChoices, IAmqSong} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {AMQ_SONG_LIST_PATH} from '../config'
import {ServerDataError} from '../exceptions'
import {v4 as uuid} from 'uuid'

class AmqSongDatabase {
  protected _songList: Array<IAmqSong>
  protected _songIds: Set<string>
  protected _animeChoices: Array<string>
  protected _titleChoices: Array<string>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._songList = readFile(AMQ_SONG_LIST_PATH)
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

  public getSongList(): Array<IAmqSong> {
    return this._songList
  }

  public getFilteredSongList(songIds: Set<string>): Array<IAmqSong> {
    return this._songList.filter((song: IAmqSong) => {
      return songIds.has(song.songId)
    })
  }

  public getChoices(): IAmqChoices {
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

  public editSong(songToEdit: IAmqSong): void {
    this.validateSongIdExists(songToEdit.songId)
    let index = this._songList.findIndex((song: IAmqSong) => {
      return song.songId == songToEdit.songId
    })
    this._songList[index] = songToEdit
    this._saveList()
  }

  public addSong(song: IAmqSong, songIdOverride: string = null): void {
    let songId = uuid()
    if (songIdOverride) {
      songId = songIdOverride
    }
    this.validateSongIdNotExists(songId)
    song.songId = songId
    this._songList.push(song)
    this._songIds.add(songId)
    this._saveList()
  }

  public deleteSong(songToDelete: IAmqSong): void {
    this.validateSongIdExists(songToDelete.songId)
    let index = this._songList.findIndex((song: IAmqSong) => {
      return song.songId == songToDelete.songId
    })
    this._songList.splice(index, 1)
    this._songIds.delete(songToDelete.songId)
    this._saveList()
  }

  public validateSongIdNotExists(songId: string): void {
    if (this._songIds.has(songId)) {
      throw new ServerDataError('Song ID already in database')
    }
  }

  protected _addAnimeChoice(song: IAmqSong, animeDupes: Set<string>): void {
    for (let anime of song.anime) {
      let lowerCaseAnime = anime.toLowerCase()
      if (!animeDupes.has(lowerCaseAnime)) {
        this._animeChoices.push(anime)
        animeDupes.add(lowerCaseAnime)
      }
    }
  }

  protected _addTitleChoice(song: IAmqSong, titleDupes: Set<string>): void {
    let lowerCaseTitle = song.title.toLowerCase()
    if (!titleDupes.has(lowerCaseTitle)) {
      this._titleChoices.push(song.title)
      titleDupes.add(lowerCaseTitle)
    }
  }

  protected _saveList(): void {
    writeFile(AMQ_SONG_LIST_PATH, this._songList)
  }
}

export {AmqSongDatabase}
