import { ROOM_NAME_PREFIX } from './constants'

function isGameRoom(roomId: string): boolean {
  return roomId.includes(ROOM_NAME_PREFIX)
}

export {
  isGameRoom
}
