import {IAmqSong, IAwqChoices, IAwqWeapon} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {AWQ_WEAPON_LIST_PATH} from '../config'
import {v4 as uuid} from 'uuid'
import {ServerDataError} from '../exceptions'

class AwqWeaponDatabase {
  protected _weaponList: Array<IAwqWeapon>
  protected _weaponIds: Set<string>
  protected _animeChoices: Array<string>
  protected _weaponChoices: Array<string>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._weaponList = readFile(AWQ_WEAPON_LIST_PATH)
    this.loadSecondaryData()
  }

  public loadSecondaryData(): void {
    this._weaponIds = new Set()
    this._animeChoices = []
    this._weaponChoices = []

    let animeDupes: Set<string> = new Set()
    let weaponDupes: Set<string> = new Set()

    for (let weapon of this._weaponList) {
      this._weaponIds.add(weapon.weaponId)
      this._addAnimeChoice(weapon, animeDupes)
      this._addWeaponChoices(weapon, weaponDupes)
    }
  }

  public getWeaponList(): Array<IAwqWeapon> {
    return this._weaponList
  }

  public getChoices(): IAwqChoices {
    return {
      anime: this._animeChoices,
      weapon: this._weaponChoices
    }
  }

  public addWeapon(weapon: IAwqWeapon, idOverride: string = null): void {
    let weaponId = uuid()
    if (idOverride) {
      weaponId = idOverride
    }
    this._validateWeaponIdNotExists(weaponId)
    weapon.weaponId = weaponId
    this._weaponList.push(weapon)
    this._weaponIds.add(weaponId)
    this._saveList()
  }

  public deleteWeapon(weaponToDelete: IAwqWeapon): void {
    this._validateWeaponIdExists(weaponToDelete.weaponId)
    let index = this._weaponList.findIndex((weapon: IAwqWeapon) => {
      return weapon.weaponId === weaponToDelete.weaponId
    })
    this._weaponList.splice(index, 1)
    this._weaponIds.delete(weaponToDelete.weaponId)
    this._saveList()
  }

  public editWeapon(weaponToEdit: IAwqWeapon): void {
    this._validateWeaponIdExists(weaponToEdit.weaponId)
    let index = this._weaponList.findIndex((weapon: IAwqWeapon) => {
      return weapon.weaponId === weaponToEdit.weaponId
    })
    this._weaponList[index] = weaponToEdit
    this._saveList()
  }

  protected _saveList(): void {
    writeFile(AWQ_WEAPON_LIST_PATH, this._weaponList)
  }

  protected _validateWeaponIdNotExists(weapondId: string): void {
    if (this._weaponIds.has(weapondId)) {
      throw new ServerDataError('Weapon ID already in database')
    }
  }

  protected _validateWeaponIdExists(weaponId: string): void {
    if (!this._weaponIds.has(weaponId)) {
      throw new ServerDataError('Weapon ID not in database')
    }
  }

  protected _addAnimeChoice(weapon: IAwqWeapon, animeDupes: Set<string>): void {
    for (let anime of weapon.anime) {
      let lowerCaseAnime = anime.toLowerCase()
      if (!animeDupes.has(lowerCaseAnime)) {
        this._animeChoices.push(anime)
        animeDupes.add(lowerCaseAnime)
      }
    }
  }

  protected _addWeaponChoices(weapon: IAwqWeapon, weaponDupes: Set<string>): void {
    let lowerCaseWeapon = weapon.name.toLowerCase()
    if (!weaponDupes.has(lowerCaseWeapon)) {
      this._weaponChoices.push(weapon.name)
      weaponDupes.add(lowerCaseWeapon)
    }
  }
}

export {AwqWeaponDatabase}
