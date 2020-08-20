import {IRoomSerial} from '../../../shared/interfaces/game'
import {IAmqGameState, IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'
import {IAmqChoices, IAmqSong, IAwqChoices, IAwqWeapon, IChatBot, IEmoji} from '../../../shared/interfaces/database'

interface IRootStoreState {
}

interface IClientStoreState {
  admin: boolean
  view: string
  username: string
  avatar: string
  avatarMap: { [key: string]: string }
}

interface IAmqStoreState {
  host: boolean
  playerList: Array<IAmqPlayer>
  settings: IAmqSettings
  gameState: IAmqGameState
  songList: Array<IAmqSong>
  users: Array<string>
  userSongs: Set<string>
  currentUser: string
  choices: IAmqChoices
  songListFilter: IAmqSongListFilter
  roomList: Array<IRoomSerial>
}

interface IAmqSongListFilter {
  anime: string
  title: string
  type: string
}

interface IEmojiStoreState {
  emojiList: Array<IEmoji>
  emojiListFilter: IEmojiListFilter
}

interface IEmojiListFilter {
  command: string
}

interface IChatBotStoreState {
  chatBotList: Array<IChatBot>
  chatBotListFilter: IChatBotListFilter
}

interface IChatBotListFilter {
  regex: string
}

interface IAvatar {
  avatar: string
  src: string
}

interface IAwqStoreState {
  host: boolean
  weaponList: Array<IAwqWeapon>
  choices: IAwqChoices
  weaponListFilter: IAwqWeaponListFilter
}

interface IAwqWeaponListFilter {
  anime: string
  weapon: string
}

interface ILobbyCard {
  isAdmin: boolean
  color: string
  label: string
  description: string
  command: string | null
  icon: string
  key: string
}

export {
  IClientStoreState,
  IRootStoreState,
  IAmqSongListFilter,
  IAmqStoreState,
  IEmojiStoreState,
  IEmojiListFilter,
  IChatBotStoreState,
  IChatBotListFilter,
  IAwqStoreState,
  IAvatar,
  IAwqWeaponListFilter,
  ILobbyCard
}
