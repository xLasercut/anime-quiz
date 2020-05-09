import {IChoices, ISong} from '../../../shared/interfaces/database'
import {ILoginMode, IRoomMode} from '@/assets/types'

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
}

interface ISongListFilter {
  anime: string
  title: string
  type: string
}

export {IListStoreState, IRooteStoreState, IClientStoreState, ISongListFilter}
