import {IAwqWeapon} from './database'
import {IBannerColor} from '../types/game'

interface IAwqSettings {
  weaponCount: number
  guessTime: number
  duplicate: boolean
}

interface IAwqGameState {
  currentWeapon: IAwqWeapon
  currentWeaponCount: number
  maxWeaponCount: number
  playing: boolean
}

interface IAwqGuess {
  weapon: string
  anime: string
}

interface IAwqPlayer {
  username: string
  avatar: string
  score: number
  admin: boolean
  host: boolean
  socketId: string
  color: IBannerColor
  guess: IAwqGuess
}


export {IAwqSettings, IAwqGuess, IAwqGameState, IAwqPlayer}
