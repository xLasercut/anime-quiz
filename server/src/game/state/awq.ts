import {IAwqWeapon} from '../../../../shared/interfaces/database'
import {IBannerColor} from '../../../../shared/types/game'
import {IAwqGameState, IAwqGuess, IAwqSettings} from '../../../../shared/interfaces/awq'
import {AbstractGameState} from './abstract'

class AwqGameState extends AbstractGameState {
  public playing = false
  public maxWeaponCount = 0
  public currentWeaponCount = 0
  public gameList: Array<IAwqWeapon> = []
  public weaponOverride: IAwqWeapon
  public currentWeapon: IAwqWeapon = {
    anime: [''],
    src: '',
    weaponId: '',
    name: ''
  }

  public prepareGameList(weaponList: Array<IAwqWeapon>, settings: IAwqSettings): void {
    this.gameList = []
    let dupes: Set<string> = new Set()
    let weaponCount = settings.weaponCount
    let duplicate = settings.duplicate
    let gameWeaponList = weaponList

    this._addToGameList(gameWeaponList, weaponCount, dupes, duplicate)
  }

  public startGame(): void {
    this.playing = true
    this.maxWeaponCount = this.gameList.length
  }

  public newWeapon(): void {
    let i = this._getRandomIndex(this.gameList)
    this.currentWeapon = this.gameList[i]
    this.gameList.splice(i, 1)
    if (this.weaponOverride) {
      this.currentWeapon = this.weaponOverride
      this.weaponOverride = null
    }

    this.currentWeaponCount += 1
  }

  public calculateScore(amqGuess: IAwqGuess) {
    let point = 0
    let color: IBannerColor = 'error'
    let animes = this.currentWeapon.anime.map((anime: string) => {
      return anime.toLowerCase()
    })

    if (amqGuess.anime && animes.includes(amqGuess.anime.toLowerCase())) {
      point += 1
    }

    if (amqGuess.weapon && amqGuess.weapon.toLowerCase() === this.currentWeapon.name.toLowerCase()) {
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

  public serialize(): IAwqGameState {
    return {
      currentWeapon: this.currentWeapon,
      currentWeaponCount: this.currentWeaponCount,
      maxWeaponCount: this.maxWeaponCount,
      playing: this.playing
    }
  }

  public reset(): void {
    this.currentWeaponCount = 0
    this.maxWeaponCount = 0
    this.playing = false
    this.weaponOverride = null
  }

  protected _addToGameList(sourceList: Array<IAwqWeapon>, weaponCount: number, dupes: Set<string>, duplicate: boolean): void {
    while (sourceList.length > 0 && this.gameList.length < weaponCount) {
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

export {AwqGameState}
