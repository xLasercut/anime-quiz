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

interface IChatBot {
  regex: string
  flag: string
  response: IChatBotResponse
}

interface IChatBotResponse {
  user: string
  text: string
  avatar: string
  id: string
}

export {ISong, IChoices, IEmoji, IChatBotResponse, IChatBot}
