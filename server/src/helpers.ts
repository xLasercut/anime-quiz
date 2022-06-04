import { ROOM_NAME_PREFIX } from './constants'
import { AqSong } from './shared/interfaces'

function isGameRoom(roomId: string): boolean {
  return roomId.includes(ROOM_NAME_PREFIX)
}

function shuffleSongList(songList: AqSong[]): AqSong[] {
  const shuffledList = [].concat(songList)
  let currentIndex = shuffledList.length, randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [ shuffledList[currentIndex], shuffledList[randomIndex] ] = [
      shuffledList[randomIndex], shuffledList[currentIndex] ]
  }
  return shuffledList
}

export {
  isGameRoom,
  shuffleSongList
}
