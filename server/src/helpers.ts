import { ROOM_NAME_PREFIX } from './constants'
import { AqSong } from './shared/interfaces'

function isGameRoom(roomId: string): boolean {
  return roomId.includes(ROOM_NAME_PREFIX)
}

export {
  isGameRoom
}
