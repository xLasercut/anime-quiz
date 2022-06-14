import { AqSong } from './interfaces'

function shuffleSongList(songList: AqSong[]): AqSong[] {
  const shuffledList = [...songList]
  let currentIndex = shuffledList.length,
    randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[shuffledList[currentIndex], shuffledList[randomIndex]] = [
      shuffledList[randomIndex],
      shuffledList[currentIndex]
    ]
  }
  return shuffledList
}

export { shuffleSongList }
