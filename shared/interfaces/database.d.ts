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

export {IAmqSong, IAmqChoices, IEmoji, IChatBot}
