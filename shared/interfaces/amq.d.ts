import {IBannerColor} from '../types/game'
import {IAmqGameMode} from '../types/amq'


interface IAmqPlayer {
  username: string
  avatar: string
  score: number
  admin: boolean
  host: boolean
  color: IBannerColor
  guess: {
    title: string
    anime: string
  }
}

interface IAmqSettings {
  songCount: number
  guessTime: number
  gameMode: IAmqGameMode
  duplicate: boolean
  selectTime: number
  users: Array<string>
  leastPlayed: boolean
}


export {IAmqPlayer, IAmqSettings}
