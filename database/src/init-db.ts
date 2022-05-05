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
    song_title text not null,
    src        text not null,
    artist     text,
    type       text not null
)`)

db.run(`CREATE TABLE animes
(
    anime_id   text not null
        constraint animes_pk
            primary key,
    anime_name text not null
)`)

db.run(`CREATE TABLE alternate_anime_names
(
    anime_id           text not null,
    alternate_anime_name text not null
)`)

db.close()
