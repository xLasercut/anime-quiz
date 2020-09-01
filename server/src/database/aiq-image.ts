import {IAiqChoices, IAiqImage} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {AIQ_IMAGE_LIST_PATH} from '../config'
import {v4 as uuid} from 'uuid'
import {ServerDataError} from '../exceptions'

class AiqImageDatabase {
  protected _imageList: Array<IAiqImage>
  protected _imageIds: Set<string>
  protected _animeChoices: Array<string>
  protected _nameChoices: Array<string>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._imageList = readFile(AIQ_IMAGE_LIST_PATH)
    this.loadSecondaryData()
  }

  public loadSecondaryData(): void {
    this._imageIds = new Set()
    this._animeChoices = []
    this._nameChoices = []

    let animeDupes: Set<string> = new Set()
    let nameDupes: Set<string> = new Set()

    for (let image of this._imageList) {
      this._imageIds.add(image.imageId)
      this._addAnimeChoice(image, animeDupes)
      this._addNameChoices(image, nameDupes)
    }
  }

  public getImageList(): Array<IAiqImage> {
    return this._imageList
  }

  public getChoices(): IAiqChoices {
    return {
      anime: this._animeChoices,
      name: this._nameChoices
    }
  }

  public addImage(image: IAiqImage, idOverride: string = null): void {
    let imageId = uuid()
    if (idOverride) {
      imageId = idOverride
    }
    this._validateImageIdNotExists(imageId)
    image.imageId = imageId
    this._imageList.push(image)
    this._imageIds.add(imageId)
    this._saveList()
  }

  public deleteImage(imageToDelete: IAiqImage): void {
    this._validateImageIdExists(imageToDelete.imageId)
    let index = this._imageList.findIndex((image: IAiqImage) => {
      return image.imageId === imageToDelete.imageId
    })
    this._imageList.splice(index, 1)
    this._imageIds.delete(imageToDelete.imageId)
    this._saveList()
  }

  public editImage(imageToEdit: IAiqImage): void {
    this._validateImageIdExists(imageToEdit.imageId)
    let index = this._imageList.findIndex((image: IAiqImage) => {
      return image.imageId === imageToEdit.imageId
    })
    this._imageList[index] = imageToEdit
    this._saveList()
  }

  protected _saveList(): void {
    writeFile(AIQ_IMAGE_LIST_PATH, this._imageList)
  }

  protected _validateImageIdNotExists(imageId: string): void {
    if (this._imageIds.has(imageId)) {
      throw new ServerDataError('Image ID already in database')
    }
  }

  protected _validateImageIdExists(imageId: string): void {
    if (!this._imageIds.has(imageId)) {
      throw new ServerDataError('Image ID not in database')
    }
  }

  protected _addAnimeChoice(image: IAiqImage, animeDupes: Set<string>): void {
    for (let anime of image.anime) {
      let lowerCaseAnime = anime.toLowerCase()
      if (!animeDupes.has(lowerCaseAnime)) {
        this._animeChoices.push(anime)
        animeDupes.add(lowerCaseAnime)
      }
    }
  }

  protected _addNameChoices(image: IAiqImage, nameDupes: Set<string>): void {
    let lowerCaseWeapon = image.name.toLowerCase()
    if (!nameDupes.has(lowerCaseWeapon)) {
      this._nameChoices.push(image.name)
      nameDupes.add(lowerCaseWeapon)
    }
  }
}

export {AiqImageDatabase}
