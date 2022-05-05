import {Database} from 'sqlite3'
import * as path from 'path'
import * as fs from 'fs'
import {ANIME_QUIZ_DATA_DIR, DATA_DIR} from './constants'
import {v4} from 'uuid'

const db = new Database(path.join(ANIME_QUIZ_DATA_DIR, 'anime-quiz.db'))


async function dbRun(db, query) {
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

async function dbAll(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

dbRun(db, `ATTACH DATABASE '${path.join(ANIME_QUIZ_DATA_DIR, 'anime-quiz-user.db')}' as user;`)
  .then(() => {
    return dbAll(db, `
select
    *,
    json_group_array(anime_name) as anime_name
from
    user.user_songs
inner join songs
on user.user_songs.song_id = songs.song_id
inner join animes
on songs.anime_id = animes.anime_id
group by songs.song_id;
`)
  })
  .then((rows) => {
    console.log(rows)
    return dbRun(db, `DETACH user;`)
  })
  .then(() => {
    db.close()
  })
  .catch(err => console.log(err))


