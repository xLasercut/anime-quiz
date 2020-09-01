import {IAiqImage} from '../../../../shared/interfaces/database'
import {IBannerColor} from '../../../../shared/types/game'
import {IAiqGameState, IAiqGuess, IAiqSettings} from '../../../../shared/interfaces/aiq'
import {AbstractGameState} from './abstract'

class AiqGameState extends AbstractGameState {
  public playing = false
  public maxImageCount = 0
  public currentImageCount = 0
  public gameList: Array<IAiqImage> = []
  public imageOverride: IAiqImage
  public currentImage: IAiqImage = {
    anime: [''],
    src: '',
    imageId: '',
    name: ''
  }

  public prepareGameList(imageList: Array<IAiqImage>, settings: IAiqSettings): void {
    this.gameList = []
    let dupes: Set<string> = new Set()
    let weaponCount = settings.imageCount
    let duplicate = settings.duplicate
    let gameImageList = imageList

    this._addToGameList(gameImageList, weaponCount, dupes, duplicate)
  }

  public startGame(): void {
    this.playing = true
    this.maxImageCount = this.gameList.length
  }

  public newImage(): void {
    let i = this._getRandomIndex(this.gameList)
    this.currentImage = this.gameList[i]
    this.gameList.splice(i, 1)
    if (this.imageOverride) {
      this.currentImage = this.imageOverride
      this.imageOverride = null
    }

    this.currentImageCount += 1
  }

  public calculateScore(amqGuess: IAiqGuess) {
    let point = 0
    let color: IBannerColor = 'error'
    let animes = this.currentImage.anime.map((anime: string) => {
      return anime.toLowerCase()
    })

    if (amqGuess.anime && animes.includes(amqGuess.anime.toLowerCase())) {
      point += 1
    }

    if (amqGuess.name && amqGuess.name.toLowerCase() === this.currentImage.name.toLowerCase()) {
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

  public serialize(): IAiqGameState {
    return {
      currentImage: this.currentImage,
      currentImageCount: this.currentImageCount,
      maxImageCount: this.maxImageCount,
      playing: this.playing
    }
  }

  public reset(): void {
    this.currentImageCount = 0
    this.maxImageCount = 0
    this.playing = false
    this.imageOverride = null
  }

  protected _addToGameList(sourceList: Array<IAiqImage>, imageCount: number, dupes: Set<string>, duplicate: boolean): void {
    while (sourceList.length > 0 && this.gameList.length < imageCount) {
      let i = this._getRandomIndex(sourceList)
      let anime = sourceList[i].anime[0]
      if (!dupes.has(anime) || duplicate) {
        this.gameList.push(sourceList[i])
        dupes.add(anime)
      }
      sourceList.splice(i, 1)
    }
  }

  protected _getRandomIndex(list: Array<any>): number {
    return Math.floor(Math.random() * list.length)
  }
}

export {AiqGameState}
