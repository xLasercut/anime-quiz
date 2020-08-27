import {IAmqSong} from '../../../../shared/interfaces/database'
import {IAmqGameState, IAmqGuess, IAmqSettings} from '../../../../shared/interfaces/amq'
import {IBalancedAmqSongLists, INormalAmqSongLists} from '../../interfaces'
import {IBannerColor} from '../../../../shared/types/game'
import {AbstractGameState} from './abstract'

class AmqGameState extends AbstractGameState {
  public playing = false
  public maxSongCount = 0
  public currentSongCount = 0
  public startPosition = 0
  public gameList: Array<IAmqSong> = []
  public songOverride: IAmqSong
  public currentSong: IAmqSong = {
    anime: [''],
    title: '',
    artist: '',
    src: '',
    type: '',
    songId: ''
  }

  public playedSongIds: Set<string> = new Set()

  public prepareGameList(gameSongList: INormalAmqSongLists, settings: IAmqSettings): void {
    this.gameList = []
    let dupes: Set<string> = new Set()
    let songCount = settings.songCount
    let duplicate = settings.duplicate
    let priorityList = gameSongList.priority
    let normalList = gameSongList.normal

    if (settings.leastPlayed) {
      if (priorityList.length <= songCount) {
        this.playedSongIds = new Set()
      }
      this._addToGameList(priorityList, songCount, dupes, duplicate)
      this._addToGameList(normalList, songCount, dupes, duplicate)
    }
    else {
      let combinedList = normalList.concat(priorityList)
      this._addToGameList(combinedList, songCount, dupes, duplicate)
    }
  }

  public prepareBalancedGameList(gameSongList: IBalancedAmqSongLists, settings: IAmqSettings): void {
    this.gameList = []
    let dupes: Set<string> = new Set()
    let dupeSongIds: Set<string> = new Set()
    let duplicate = settings.duplicate
    let playerCount = Object.keys(gameSongList).length
    let songCountPerPlayer = Math.floor(settings.songCount / playerCount)
    let priorityCount = 0
    let loopCount = 0

    for (let songLists of Object.values(gameSongList)) {
      loopCount += 1
      let normalList = songLists.normal
      let priorityList = songLists.priority
      let songCount = songCountPerPlayer * loopCount
      priorityCount += priorityList.length

      if (settings.leastPlayed) {
        this._addToBalancedGameList(priorityList, songCount, dupes, dupeSongIds, duplicate)
        this._addToBalancedGameList(normalList, songCount, dupes, dupeSongIds, duplicate)
      }
      else {
        let combinedList = normalList.concat(priorityList)
        this._addToBalancedGameList(combinedList, songCount, dupes, dupeSongIds, duplicate)
      }
    }

    if (settings.leastPlayed && priorityCount <= settings.songCount) {
      this.playedSongIds = new Set()
    }
  }

  public startGame(): void {
    this.playing = true
    this.maxSongCount = this.gameList.length
  }

  public newSong(leastPlayed: boolean): void {
    let i = this._getRandomIndex(this.gameList)
    this.currentSong = this.gameList[i]
    this.gameList.splice(i, 1)
    if (this.songOverride) {
      this.currentSong = this.songOverride
      this.songOverride = null
    }

    this.currentSongCount += 1
    this.startPosition = Math.random()
    if (leastPlayed) {
      this.playedSongIds.add(this.currentSong.songId)
    }
  }

  public calculateScore(amqGuess: IAmqGuess) {
    let point = 0
    let color: IBannerColor = 'error'
    let animes = this.currentSong.anime.map((anime: string) => {
      return anime.toLowerCase()
    })

    if (amqGuess.anime && animes.includes(amqGuess.anime.toLowerCase())) {
      point += 1
    }

    if (amqGuess.title && amqGuess.title.toLowerCase() === this.currentSong.title.toLowerCase()) {
      point += 1
    }

    if (point === 2) {
      color = 'success'
    }
    else if (point === 1) {
      color = 'warning'
    }

    return {point, color}
  }

  public serialize(): IAmqGameState {
    return {
      currentSong: this.currentSong,
      currentSongCount: this.currentSongCount,
      maxSongCount: this.maxSongCount,
      startPosition: this.startPosition,
      playing: this.playing
    }
  }

  public reset(): void {
    this.currentSongCount = 0
    this.maxSongCount = 0
    this.playing = false
    this.startPosition = 0
    this.songOverride = null
  }

  protected _addToBalancedGameList(sourceList: Array<IAmqSong>, songCount: number, dupes: Set<string>, dupeSongIds: Set<string>, duplicate: boolean): void {
    while (sourceList.length > 0 && this.gameList.length < songCount) {
      let i = this._getRandomIndex(sourceList)
      let anime = sourceList[i].anime[0]
      let songId = sourceList[i].songId
      if ((!dupes.has(anime) || duplicate) && !dupeSongIds.has(songId)) {
        this.gameList.push(sourceList[i])
        dupes.add(anime)
        dupeSongIds.add(songId)
      }
      sourceList.splice(i, 1)
    }
  }

  protected _addToGameList(sourceList: Array<IAmqSong>, songCount: number, dupes: Set<string>, duplicate: boolean): void {
    while (sourceList.length > 0 && this.gameList.length < songCount) {
      let i = this._getRandomIndex(sourceList)
      let anime = sourceList[i].anime[0]
      if (!dupes.has(anime) || duplicate) {
        this.gameList.push(sourceList[i])
        dupes.add(anime)
      }
      sourceList.splice(i, 1)
    }
  }
}

export {AmqGameState}
