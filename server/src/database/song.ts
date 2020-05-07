import {IChoices, ISong} from '../../../shared/interfaces/database'
import {readFile} from './helper'
import {SONG_LIST_PATH} from '../config'
import {ServerDataError} from '../exceptions'

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
