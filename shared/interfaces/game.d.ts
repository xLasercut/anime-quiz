interface IRoomSerial {
  name: string
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
