import {IEmojiType} from '../types/game'

interface ISong {
  songId: string
  anime: Array<string>
  src: string
  title: string
  artist: string
  type: string
}

interface IChoices {
  anime: Array<string>
  title: Array<string>
}

interface IEmoji {
  src: string
  command: string
  type: IEmojiType
}

export {ISong, IChoices, IEmoji}
