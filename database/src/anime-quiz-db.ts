import {Database} from 'sqlite3'
import * as path from 'path'
import * as fs from 'fs'
import {ANIME_QUIZ_DATA_DIR, DATA_DIR} from './constants'
import {v4} from 'uuid'

const db = new Database(path.join(ANIME_QUIZ_DATA_DIR, 'anime-quiz.db'))
// const animeData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'anime-names.json'), 'utf-8'))
//   .map(item => {
//     return [item.animeId, item.animeName]
//   })
//
//
// const query = 'INSERT INTO animes (anime_id, anime_name) VALUES (?, ?)'
// const statement = db.prepare(query)
//
// for (const anime of animeData) {
//   statement.run(anime, (err) => {
//     if (err) {
//       throw err
//     }
//   })
// }
//
// statement.finalize()


const animeData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'anime-names.json'), 'utf-8'))

function getAnime(name) {
  for (const anime of animeData) {
    if (anime.animeName === name) {
      return anime.animeId
    }
  }
  return 'NOT_FOUND'
}

const unmatchedAnimeThemes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'unmatched-animethemes.json'), 'utf-8'))
  .map(song => {
    const {anime, songId, ...rest} = song
    return {
      ...rest,
      anime: getAnime(anime[0]),
      songId: `song-${v4()}`
    }
  })
  .map(song => {
    return [
      song.songId,
      song.anime,
      song.title || null,
      song.src || null,
      song.artist || null,
      song.type || null
    ]
  })

const query = 'INSERT INTO songs (song_id, anime_id, song_title, src, artist, type) VALUES (?, ?, ?, ?, ?, ?)'
const statement = db.prepare(query)

for (const songData of unmatchedAnimeThemes) {
  statement.run(songData, (err) => {
    if (err) {
      throw err
    }
  })
}

statement.finalize()

db.close()
