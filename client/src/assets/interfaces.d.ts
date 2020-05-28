import {IChatBot, IChoices, IEmoji, ISong} from '../../../shared/interfaces/database'
import {ILoginMode, IMiscMode, IRoomMode} from '@/assets/types'
import {IAmqPlayer} from '../../../shared/interfaces/amq'
import {IRoomSerial} from '../../../shared/interfaces/game'

interface IRooteStoreState {

}

interface IListStoreState {
  songList: Array<ISong>
  users: Array<string>
  userSongs: Set<string>
  currentUser: string
  choices: IChoices
  songListFilter: ISongListFilter
}

interface IClientStoreState {
  admin: boolean
  loginMode: ILoginMode
  username: string
  avatar: string
  roomMode: IRoomMode
  roomList: Array<IRoomSerial>
  avatarMap: {[key: string]: string}
}

interface ISongListFilter {
  anime: string
  title: string
  type: string
}

interface IAmqStoreState {
  playerList: Array<IAmqPlayer>
}

interface IMiscStoreState {
  miscMode: IMiscMode
  emojiList: Array<IEmoji>
  emojiListFilter: IEmojiListFilter
  chatBotList: Array<IChatBot>
  chatBotListFilter: IChatBotListFilter
}

interface IEmojiListFilter {
  command: string
}

interface IChatBotListFilter {
  regex: string
}

interface IAvatar {
  avatar: string
  src: string
}

export {
  IListStoreState,
  IRooteStoreState,
  IClientStoreState,
  ISongListFilter,
  IAmqStoreState,
  IMiscStoreState,
  IEmojiListFilter,
  IChatBotListFilter,
  IAvatar
}
