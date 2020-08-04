import {IBannerColor} from '../types/game'
import {IAmqGameMode} from '../types/amq'
import {ISong} from './database'


interface IAmqPlayer {
  username: string
  avatar: string
  score: number
  admin: boolean
  host: boolean
  socketId: string
  color: IBannerColor
  guess: IAmqGuess
}

interface IAmqSettings {
  songCount: number
  guessTime: number
  gameMode: IAmqGameMode
  duplicate: boolean
  users: Array<string>
  leastPlayed: boolean
}

interface IAmqGameState {
  currentSong: ISong
  currentSongCount: number
  maxSongCount: number
  playing: boolean
  startPosition: number
}

interface IAmqGuess {
  title: string
  anime: string
}


export {IAmqPlayer, IAmqSettings, IAmqGameState, IAmqGuess}
