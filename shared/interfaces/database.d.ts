import {IEmojiType} from '../types/game'

interface IAmqSong {
  songId: string
  anime: Array<string>
  src: string
  title: string
  artist: string
  type: string
}

interface IAmqChoices {
  anime: Array<string>
  title: Array<string>
}

interface IEmoji {
  src: string
  command: string
  type: IEmojiType
}

interface IChatBot {
  regex: string
  flag: string
  user: string
  text: string
  avatar: string
  userId: string
}

interface IAiqImage {
  imageId: string
  anime: Array<string>
  name: string
  src: string
}

interface IAiqChoices {
  anime: Array<string>
  name: Array<string>
}

export {IAmqSong, IAmqChoices, IEmoji, IChatBot, IAiqImage, IAiqChoices}
