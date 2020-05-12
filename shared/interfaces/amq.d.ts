import {IBannerColor} from '../types/game'

interface IAmqPlayer {
  username: string
  score: number
  avatar: string
  admin: boolean
  host: boolean
  color: IBannerColor
  guess: {
    title: string
    anime: string
  }
}


export {IAmqPlayer}
