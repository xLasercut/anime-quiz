import * as path from 'path'
import * as fs from 'fs'
import {DATA_DIR} from './constants'
import {AmqSong} from './shared/interfaces'
import {v4} from 'uuid'


const rawJsonFiles = fs.readdirSync(DATA_DIR).filter((file) => {
  return file.includes('animethemes-raw-')
})

const songs: AmqSong[] = []
const animes = []

function getArtist(song): string {
  if (!song.song) {
    return ''
  }

  if (!song.song.artists) {
    return ''
  }

  if (song.song.artists.length === 0) {
    return ''
  }

  return song.song.artists[0].name || ''
}

function getTitle(song): string {
  if (!song.song) {
    return ''
  }

  return song.song.title || ''
}

function getLink(song): string {
  if (!song.animethemeentries) {
    return ''
  }

  if (song.animethemeentries.length === 0) {
    return ''
  }

  if (!song.animethemeentries[0].videos) {
    return ''
  }

  if (song.animethemeentries[0].videos.length === 0) {
    return ''
  }

  return song.animethemeentries[0].videos[0].link || ''
}

for (const file of rawJsonFiles) {
  console.log(`parsing file: ${file}`)
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'))
  for (const anime of data) {
    animes.push({
      animeId: `anime-${v4()}`,
      animeName: anime.name
    })
    for (const song of anime.animethemes) {
      songs.push({
        songId: '',
        anime: [
          anime.name
        ],
        src: getLink(song),
        artist: getArtist(song),
        title: getTitle(song),
        type: song.type
      })
    }
  }
  console.log(`finished parsing file: ${file}`)
  console.log(`total song count: ${songs.length}`)
}

fs.writeFileSync(path.join(DATA_DIR, 'animethemes-parsed.json'), JSON.stringify(songs, null, 2))
fs.writeFileSync(path.join(DATA_DIR, 'anime-names.json'), JSON.stringify(animes, null, 2))


