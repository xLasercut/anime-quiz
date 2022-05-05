import * as fs from 'fs'
import * as path from 'path'
import {ANIME_QUIZ_DATA_DIR, DATA_DIR} from './constants'
import {AmqSong} from './shared/interfaces'

const currentData = JSON.parse(fs.readFileSync(path.join(ANIME_QUIZ_DATA_DIR, 'amq-song.json'), 'utf-8'))
const parsedAnimeThemesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'animethemes-parsed.json'), 'utf-8'))


const noMatchCurrentSongs: AmqSong[] = []
const noMatchAnimeThemesSongs: AmqSong[] = []
const matchedAnimeThemesSongs: AmqSong[] = []

function matchAnimeThemesSong(videoFilename) {
  for (const animeThemesSong of parsedAnimeThemesData) {
    if (animeThemesSong.src.includes(videoFilename)) {
      return animeThemesSong
    }
  }
  return false
}

for (const currentSong of currentData) {
  const videoFilename = currentSong.src.replace('https://animethemes.moe/video/', '').replace('.webm', '')
  const matchedSong = matchAnimeThemesSong(videoFilename)
  if (matchedSong) {
    matchedAnimeThemesSongs.push({
      title: matchedSong.title,
      songId: `song-${currentSong.songId}`,
      anime: matchedSong.anime,
      src: matchedSong.src,
      type: matchedSong.type,
      artist: matchedSong.artist
    })
  } else {
    noMatchCurrentSongs.push(currentSong)
  }
}

function isAlreadyMatched(song): boolean {
  for (const matchedAnimeThemeSong of matchedAnimeThemesSongs) {
    if (song.src === matchedAnimeThemeSong.src) {
      return true
    }
  }
  return false
}


for (const animeThemesSong of parsedAnimeThemesData) {
  if (!isAlreadyMatched(animeThemesSong)) {
    noMatchAnimeThemesSongs.push(animeThemesSong)
  }
}


fs.writeFileSync(path.join(DATA_DIR, 'matched-animethemes.json'), JSON.stringify(matchedAnimeThemesSongs, null, 2))
fs.writeFileSync(path.join(DATA_DIR, 'unmatched-animethemes.json'), JSON.stringify(noMatchAnimeThemesSongs, null, 2))
fs.writeFileSync(path.join(DATA_DIR, 'unmatched-current.json'), JSON.stringify(noMatchCurrentSongs, null, 2))
