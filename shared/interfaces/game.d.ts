import {IRoomType} from '../types/game'

interface IRoomSerial {
  name: string
  type: IRoomType
  roomId: string
}

interface IChat {
  user: string
  text: string
  avatar: string
  userId: string
  repeat: boolean
  admin: boolean
}

export {IRoomSerial, IChat}
