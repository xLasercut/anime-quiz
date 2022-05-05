import * as fs from 'fs'
import * as path from 'path'
import {ANIME_QUIZ_DATA_DIR, DATA_DIR} from './constants'

const USER_DATA_DIR = path.join(ANIME_QUIZ_DATA_DIR, 'amq-user')

const matchedAnimeThemesSongs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'matched-animethemes.json'), 'utf-8'))
const noMatchAnimeThemesSongs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'unmatched-animethemes.json'), 'utf-8'))
const noMatchCurrentSongs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'unmatched-current.json'), 'utf-8'))

const userfiles = fs.readdirSync(USER_DATA_DIR).filter(file => file.includes('.json'))

function isInNoMatchCurrentSongs(songId) {
  for (const song of noMatchCurrentSongs) {
    if (song.songId.includes(songId)) {
      return true
    }
  }
  return false
}


function isInMatchedAnimeThemesSongs(songId) {
  for (const song of matchedAnimeThemesSongs) {
    if (song.songId.includes(songId)) {
      return true
    }
  }
  return false
}

for (const file of userfiles) {
  const inNoMatchCurrentSongs = []
  const inMatchedAnimeThemesSongs = []
  const notMatchAtAll = []
  const userData = JSON.parse(fs.readFileSync(path.join(USER_DATA_DIR, file), 'utf-8'))

  for (const songId of userData) {
    if (isInMatchedAnimeThemesSongs(songId)) {
      inMatchedAnimeThemesSongs.push(songId)
    } else if (isInNoMatchCurrentSongs(songId)) {
      inNoMatchCurrentSongs.push(songId)
    } else {
      notMatchAtAll.push(songId)
    }
  }

  console.log(`for user: ${file}`)
  console.log(`in anime theme: ${inMatchedAnimeThemesSongs.length}`)
  console.log(`in unmatched current: ${inNoMatchCurrentSongs.length}`)
  console.log(`no match: ${notMatchAtAll.length}`)
}