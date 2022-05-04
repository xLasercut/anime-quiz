import {Database} from 'sqlite3'
import * as path from 'path'
import {ANIME_QUIZ_DATA_DIR} from './constants'

const db = new Database(path.join(ANIME_QUIZ_DATA_DIR, 'anime-quiz.db'))


db.all('select * from songs', (error, rows) => {
  console.log(rows)
})

db.close()
