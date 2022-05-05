import {Database} from 'sqlite3'
import * as path from 'path'
import {ANIME_QUIZ_DATA_DIR} from './constants'

const db = new Database(path.join(ANIME_QUIZ_DATA_DIR, 'anime-quiz.db'))

db.run(`CREATE TABLE songs
(
    song_id    text not null
        constraint songs_pk
            primary key,
    anime_id   text not null,
    song_title text,
    src        text,
    artist     text,
    type       text
)`)

db.run(`CREATE TABLE animes
(
    anime_id   text,
    anime_name text
)`)



db.close()
